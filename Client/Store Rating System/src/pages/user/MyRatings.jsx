import React, { useEffect, useState } from 'react';
import { Star, MapPin, Pencil } from 'lucide-react';
import { SkeletonCard } from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import RatingStars from '../../components/store/RatingStars.jsx';
import Modal from '../../components/common/Modal.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import * as ratingService from '../../services/ratingService';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate } from '../../utils/formatters.js';

const MyRatings = () => {
  const toast = useToast();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editTarget, setEditTarget] = useState(null);
  const [editValue, setEditValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ratingService.getMyRatings();
      setRatings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (rating) => {
    setEditTarget(rating);
    setEditValue(rating.rating);
  };

  const handleUpdate = async () => {
    if (!editValue) return;
    setSubmitting(true);
    try {
      await ratingService.updateRating(editTarget.id, editValue);
      toast.success('Rating updated.');
      setEditTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not update rating.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink-900">My Ratings</h2>
        <p className="mt-1 text-sm text-ink-500">Ratings you&apos;ve submitted across all stores.</p>
      </div>

      {error && !loading && <ErrorState message={error} onRetry={load} />}

      {!error && loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!error && !loading && ratings.length === 0 && (
        <EmptyState icon={Star} title="No ratings yet" message="Browse stores and submit your first rating." />
      )}

      {!error && !loading && ratings.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ratings.map((r) => (
            <div key={r.id} className="card flex flex-col gap-3 p-5">
              <div>
                <h3 className="text-base font-semibold text-ink-900">{r.store_name}</h3>
                <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-500">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-2">{r.store_address}</span>
                </p>
              </div>
              <RatingStars value={r.rating} />
              <p className="text-xs text-ink-400">Rated on {formatDate(r.created_at)}</p>
              <button onClick={() => openEdit(r)} className="btn-secondary w-full">
                <Pencil className="h-4 w-4" />
                Edit Rating
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Update your rating"
        size="sm"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setEditTarget(null)} disabled={submitting}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleUpdate} disabled={submitting}>
              {submitting && <LoadingSpinner size="sm" className="text-white" />}
              Save Changes
            </button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div>
            <p className="text-sm font-semibold text-ink-900">{editTarget?.store_name}</p>
            <p className="text-xs text-ink-500">{editTarget?.store_address}</p>
          </div>
          <RatingStars value={editValue} onChange={setEditValue} interactive size="lg" label="Select your rating" />
        </div>
      </Modal>
    </div>
  );
};

export default MyRatings;
