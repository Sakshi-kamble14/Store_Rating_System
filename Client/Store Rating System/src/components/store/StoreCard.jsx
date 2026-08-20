import React from 'react';
import { MapPin, Star } from 'lucide-react';
import RatingStars from './RatingStars.jsx';
import { formatRating } from '../../utils/formatters.js';

const StoreCard = ({ store, onRate }) => {
  const hasMyRating = store.myRating !== null && store.myRating !== undefined;

  return (
    <div className="card flex flex-col gap-4 p-5">
      <div>
        <h3 className="text-base font-semibold text-ink-900">{store.name}</h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-500">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-2">{store.address}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 fill-warning-500 text-warning-500" />
        <span className="text-sm font-semibold text-ink-800">{formatRating(store.overallRating)}</span>
        <span className="text-xs text-ink-400">overall rating</span>
      </div>

      <div className="rounded-lg bg-ink-50 px-3 py-2.5">
        <p className="mb-1 text-xs font-medium text-ink-500">Your rating</p>
        <RatingStars value={hasMyRating ? store.myRating : 0} size="sm" />
      </div>

      <button onClick={() => onRate(store)} className="btn-primary w-full">
        {hasMyRating ? 'Update Rating' : 'Rate Store'}
      </button>
    </div>
  );
};

export default StoreCard;
