import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const getPageList = (current, total) => {
  const pages = [];
  const windowSize = 1;
  for (let i = 1; i <= total; i += 1) {
    if (i === 1 || i === total || (i >= current - windowSize && i <= current + windowSize)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }
  return pages;
};

const Pagination = ({ page, totalPages, onPageChange, total, limit }) => {
  if (!totalPages || totalPages <= 1) return null;

  const pages = getPageList(page, totalPages);
  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-100 px-1 py-4 sm:flex-row">
      <p className="text-sm text-ink-500">
        Showing <span className="font-medium text-ink-700">{rangeStart}</span>–
        <span className="font-medium text-ink-700">{rangeEnd}</span> of{' '}
        <span className="font-medium text-ink-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-1.5 text-sm text-ink-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium ${
                p === page ? 'bg-primary-600 text-white' : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
