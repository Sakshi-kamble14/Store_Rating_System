import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { SkeletonRow } from './Skeleton.jsx';
import EmptyState from './EmptyState.jsx';
import ErrorState from './ErrorState.jsx';

/**
 * columns: [{ key, label, sortable, render?: (row) => node, className? }]
 */
const DataTable = ({
  columns,
  rows,
  loading,
  error,
  onRetry,
  emptyTitle = 'No records found',
  emptyMessage = 'Try adjusting your filters or search terms.',
  sortBy,
  sortOrder,
  onSort,
  rowKey = 'id'
}) => {
  const handleSort = (col) => {
    if (!col.sortable || !onSort) return;
    if (sortBy === col.key) {
      onSort(col.key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(col.key, 'asc');
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/70 backdrop-blur-xl shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50/50 text-xs font-semibold uppercase tracking-wider text-ink-500 border-b border-ink-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={`px-5 py-4 ${col.className || ''}`}>
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col)}
                      className="flex items-center gap-1 hover:text-ink-800 transition-colors"
                    >
                      {col.label}
                      {sortBy === col.key ? (
                        sortOrder === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5 text-primary-500" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 text-primary-500" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 text-ink-300 opacity-50 group-hover:opacity-100" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100/50">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-2">
                  <EmptyState title={emptyTitle} message={emptyMessage} />
                </td>
              </tr>
            )}

            {!loading && !error &&
              rows.map((row) => (
                <tr key={row[rowKey]} className="group hover:bg-white/90 transition-colors duration-200">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-4 align-middle text-ink-700 ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!loading && error && (
        <div className="p-2">
          <ErrorState message={error} onRetry={onRetry} />
        </div>
      )}
    </div>
  );
};

export default DataTable;
