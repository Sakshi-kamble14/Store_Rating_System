import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Shield, Star, Store } from 'lucide-react';
import { Skeleton } from '../../components/common/Skeleton.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import Badge from '../../components/common/Badge.jsx';
import { roleBadgeColor, initials, formatRating } from '../../utils/formatters.js';
import * as adminService from '../../services/adminService';

const AdminUserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getUserById(id);
      setUser(data.user);
      setRating(data.rating);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="space-y-5">
      <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-700">
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Link>

      {loading && (
        <div className="card p-6">
          <Skeleton className="mb-4 h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && user && (
        <div className="space-y-5">
          <div className="card p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                  {initials(user.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900">{user.name}</h2>
                  <Badge className={`mt-1 ${roleBadgeColor(user.role)}`}>{user.role}</Badge>
                </div>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-ink-400" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Email</dt>
                  <dd className="text-sm font-medium text-ink-800">{user.email}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-ink-400" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Address</dt>
                  <dd className="text-sm font-medium text-ink-800">{user.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 text-ink-400" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Role</dt>
                  <dd className="text-sm font-medium text-ink-800">{user.role}</dd>
                </div>
              </div>
            </dl>
          </div>

          {user.role === 'OWNER' && (
            <div className="card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-800">
                <Store className="h-4 w-4 text-ink-400" />
                Owned Stores
              </h3>

              {rating !== null && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-warning-50 px-4 py-3">
                  <Star className="h-4 w-4 fill-warning-500 text-warning-500" />
                  <span className="text-sm font-semibold text-ink-800">
                    {formatRating(rating)} average rating across owned stores
                  </span>
                </div>
              )}

              {user.stores?.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {user.stores.map((store) => (
                    <div key={store.id} className="rounded-lg border border-ink-100 p-4">
                      <p className="text-sm font-semibold text-ink-800">{store.name}</p>
                      <p className="mt-1 text-xs text-ink-500">{store.address}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-500">This owner has no registered stores yet.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUserDetails;
