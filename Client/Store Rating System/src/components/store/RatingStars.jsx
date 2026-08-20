import React, { useState } from 'react';
import { Star } from 'lucide-react';

const SIZES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-7 w-7'
};

/**
 * Dual-purpose star rating.
 * - Read-only mode: pass `value` (supports decimals for display).
 * - Interactive mode: pass `interactive`, `value`, and `onChange`.
 */
const RatingStars = ({ value = 0, onChange, interactive = false, size = 'md', label }) => {
  const [hovered, setHovered] = useState(0);
  const displayValue = interactive ? hovered || value : value;

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={label || `Rating: ${value} out of 5 stars`}
      onMouseLeave={() => interactive && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive ? star <= displayValue : star <= Math.round(displayValue);
        const partial = !interactive && !filled && star - 0.5 <= displayValue;

        if (!interactive) {
          return (
            <Star
              key={star}
              className={`${SIZES[size]} ${filled || partial ? 'fill-warning-500 text-warning-500' : 'text-ink-200'}`}
            />
          );
        }

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            onClick={() => onChange?.(star)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-primary-500"
          >
            <Star className={`${SIZES[size]} ${star <= displayValue ? 'fill-warning-500 text-warning-500' : 'text-ink-200'}`} />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
