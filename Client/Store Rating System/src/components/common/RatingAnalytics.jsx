import React from 'react';
import { BarChart3, Star, TrendingUp } from 'lucide-react';

const RatingAnalytics = ({
  title = 'Rating Analytics',
  totalRatings = 0,
  averageRating = 0,
  ratingDistribution = {}
}) => {
  const distribution = {
    5: Number(ratingDistribution?.[5] || 0),
    4: Number(ratingDistribution?.[4] || 0),
    3: Number(ratingDistribution?.[3] || 0),
    2: Number(ratingDistribution?.[2] || 0),
    1: Number(ratingDistribution?.[1] || 0)
  };

  const maxCount = Math.max(
    ...Object.values(distribution),
    1
  );

  const getPercentage = (count) => {
    if (!totalRatings) return 0;

    return Math.round((count / totalRatings) * 100);
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-ink-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <BarChart3 className="h-5 w-5" />
            </div>

            <h3 className="text-base font-bold text-ink-900">
              {title}
            </h3>
          </div>

          <p className="mt-1 text-sm text-ink-500">
            Understand how customers are rating your stores.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        {/* Total Ratings */}
        <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Total Ratings
              </p>

              <p className="mt-2 text-3xl font-bold text-ink-900">
                {totalRatings}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-50 text-warning-600">
              <Star className="h-5 w-5 fill-current" />
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Average Rating
              </p>

              <div className="mt-2 flex items-center gap-2">
                <p className="text-3xl font-bold text-ink-900">
                  {Number(averageRating || 0).toFixed(1)}
                </p>

                <Star className="h-5 w-5 fill-warning-500 text-warning-500" />
              </div>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Distribution */}
      <div className="px-5 pb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-ink-800">
              Rating Distribution
            </h4>

            <p className="mt-1 text-xs text-ink-500">
              Breakdown of submitted ratings
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating];

            const width =
              count === 0
                ? 0
                : Math.max((count / maxCount) * 100, 4);

            return (
              <div
                key={rating}
                className="grid grid-cols-[48px_1fr_45px] items-center gap-3"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 text-sm font-semibold text-ink-700">
                  <span>{rating}</span>

                  <Star className="h-3.5 w-3.5 fill-warning-500 text-warning-500" />
                </div>

                {/* Bar */}
                <div className="h-2.5 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-warning-400 to-warning-500 transition-all duration-700"
                    style={{
                      width: `${width}%`
                    }}
                  />
                </div>

                {/* Count */}
                <div className="text-right text-xs font-semibold text-ink-500">
                  {count}
                  <span className="ml-1 text-ink-300">
                    ({getPercentage(count)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingAnalytics;