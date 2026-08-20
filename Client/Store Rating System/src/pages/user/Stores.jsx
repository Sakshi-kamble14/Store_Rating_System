import React, { useEffect, useState } from 'react';
import SearchBar from '../../components/common/SearchBar.jsx';
import FilterDropdown from '../../components/common/FilterDropdown.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { SkeletonCard } from '../../components/common/Skeleton.jsx';
import StoreCard from '../../components/store/StoreCard.jsx';
import RatingModal from '../../components/store/RatingModal.jsx';
import * as storeService from '../../services/storeService';
import * as ratingService from '../../services/ratingService';
import { useToast } from '../../context/ToastContext.jsx';
import { Store } from 'lucide-react';

const LIMIT = 9;

const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Newest First' },
  { value: 'name:asc', label: 'Name (A-Z)' },
  { value: 'name:desc', label: 'Name (Z-A)' },
  { value: 'address:asc', label: 'Address (A-Z)' }
];

const UserStores = () => {
  const toast = useToast();
  const [nameQuery, setNameQuery] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [sortValue, setSortValue] = useState('created_at:desc');
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [ratingTarget, setRatingTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [sortBy, sortOrder] = sortValue.split(':');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await storeService.getStores({
        name: nameQuery || undefined,
        address: addressQuery || undefined,
        sortBy,
        sortOrder,
        page,
        limit: LIMIT
      });
      setRows(res.data.stores);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameQuery, addressQuery, sortValue, page]);

  const handleSubmitRating = async (rating) => {
    setSubmitting(true);
    try {
      await ratingService.submitRating({ store_id: ratingTarget.id, rating });
      toast.success(ratingTarget.myRating ? 'Rating updated.' : 'Rating submitted.');
      setRatingTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink-900">Discover Stores</h2>
        <p className="mt-1 text-sm text-ink-500">Find stores near you and share your rating.</p>
      </div>

      <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-4">
        <SearchBar
          className="sm:col-span-2"
          value={nameQuery}
          onChange={(v) => { setNameQuery(v); setPage(1); }}
          placeholder="Search by name..."
        />
        <SearchBar value={addressQuery} onChange={(v) => { setAddressQuery(v); setPage(1); }} placeholder="Search by address..." />
        <FilterDropdown label="Sort by" value={sortValue} onChange={(v) => { setSortValue(v); setPage(1); }} options={SORT_OPTIONS} />
      </div>

      {error && !loading && <ErrorState message={error} onRetry={load} />}

      {!error && loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!error && !loading && rows.length === 0 && (
        <EmptyState icon={Store} title="No stores found" message="Try a different search term." />
      )}

      {!error && !loading && rows.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((store) => (
            <StoreCard key={store.id} store={store} onRate={setRatingTarget} />
          ))}
        </div>
      )}

      {!error && !loading && (
        <div className="card p-0">
          <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onPageChange={setPage} />
        </div>
      )}

      <RatingModal
        open={!!ratingTarget}
        onClose={() => setRatingTarget(null)}
        store={ratingTarget}
        onSubmit={handleSubmitRating}
        submitting={submitting}
      />
    </div>
  );
};

export default UserStores;
