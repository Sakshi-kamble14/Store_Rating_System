import React, { useEffect, useState } from 'react';
import {
  Star,
  MapPin,
  Users,
  Store
} from 'lucide-react';

import { SkeletonCard } from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import RatingStars from '../../components/store/RatingStars.jsx';
import RatingAnalytics from '../../components/common/RatingAnalytics.jsx';

import {
  formatRating,
  initials
} from '../../utils/formatters.js';

import * as ownerService from '../../services/ownerService';

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await ownerService.getDashboard();
      setStores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-ink-900">
          Your Store Overview
        </h2>

        <p className="mt-1 text-sm text-ink-500">
          Track your store performance and customer feedback.
        </p>
      </div>

      {/* Error */}
      {error && !loading && (
        <ErrorState
          message={error}
          onRetry={load}
        />
      )}

      {/* Loading */}
      {!error && loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Empty */}
      {!error &&
        !loading &&
        stores.length === 0 && (
          <EmptyState
            icon={Store}
            title="No stores yet"
            message="Your account isn't linked to any stores. Contact an administrator."
          />
        )}

      {/* Stores */}
      {!error &&
        !loading &&
        stores.map((store) => (
          <div
            key={store.storeId}
            className="space-y-5"
          >
            {/* Store Header */}
            <div className="card p-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-bold text-ink-900">
                    {store.storeName}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {store.address}
                  </p>
                </div>

                <div className="flex items-center gap-6 rounded-xl bg-ink-50 px-5 py-3">
                  <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-xl font-bold text-ink-900">
                      <Star className="h-4 w-4 fill-warning-500 text-warning-500" />

                      {formatRating(store.averageRating)}
                    </p>

                    <p className="text-xs text-ink-500">
                      Average Rating
                    </p>
                  </div>

                  <div className="h-8 w-px bg-ink-200" />

                  <div className="text-center">
                    <p className="text-xl font-bold text-ink-900">
                      {store.totalRatings}
                    </p>

                    <p className="text-xs text-ink-500">
                      Total Ratings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <RatingAnalytics
              title="My Store Analytics"
              totalRatings={store.totalRatings}
              averageRating={store.averageRating}
              ratingDistribution={store.ratingDistribution}
            />

            {/* Customers */}
            <div className="card p-6">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-800">
                <Users className="h-4 w-4 text-ink-400" />
                Customers Who Rated Your Store
              </h4>

              {store.raters.length === 0 ? (
                <p className="text-sm text-ink-500">
                  No customers have rated this store yet.
                </p>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-ink-100/50 bg-white/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-ink-50/50 text-xs font-semibold uppercase tracking-wider text-ink-500">
                        <tr>
                          <th className="px-5 py-4">
                            Customer
                          </th>

                          <th className="px-5 py-4">
                            Email
                          </th>

                          <th className="px-5 py-4">
                            Rating
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-ink-100/50">
                        {store.raters.map((r) => (
                          <tr
                            key={r.userId}
                            className="transition-colors duration-200 hover:bg-white"
                          >
                            <td className="flex items-center gap-3 px-5 py-4">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700 ring-2 ring-white">
                                {initials(r.name)}
                              </div>

                              <span className="font-medium">
                                {r.name}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-ink-500">
                              {r.email}
                            </td>

                            <td className="px-5 py-4">
                              <RatingStars
                                value={r.rating}
                                size="sm"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default OwnerDashboard;