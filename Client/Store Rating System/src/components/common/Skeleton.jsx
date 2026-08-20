import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-ink-200/70 ${className}`} />
);

export const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const SkeletonCard = () => (
  <div className="card p-5">
    <Skeleton className="mb-3 h-4 w-1/3" />
    <Skeleton className="h-8 w-1/2" />
  </div>
);

export default Skeleton;
