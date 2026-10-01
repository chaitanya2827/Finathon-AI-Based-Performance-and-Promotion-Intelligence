import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import EmptyState from './EmptyState';

/**
 * Enterprise DataTable with Navy Blue + Cyan Glass styling, sorting, and pagination
 */
export default function DataTable({
  columns,
  data = [],
  keyField = 'id',
  onRowClick = null,
  pageSize = 10,
  initialSortField = null,
  initialSortDirection = 'asc',
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or search terms.'
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  // Sorting
  const sortedData = React.useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [data, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedData = sortedData.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize
  );

  const handleSort = (field) => {
    if (!field) return;
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-2xl border border-cyan-500/20 bg-white/85 dark:bg-[#081A2F]/70 backdrop-blur-xl shadow-glass">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/90 dark:bg-[#061426]/90 border-b border-cyan-500/20 text-xs font-bold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`py-3.5 px-4 ${col.className || ''} ${
                    col.sortable ? 'cursor-pointer select-none hover:text-cyan-600 dark:hover:text-cyan-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10 text-sm text-[#08243D] dark:text-[#F0F9FF]">
            {paginatedData.map((row, index) => (
              <tr
                key={row[keyField] || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors duration-150 ${
                  onRowClick
                    ? 'cursor-pointer hover:bg-cyan-500/10 dark:hover:bg-[#0B223D]/80 hover:text-cyan-900 dark:hover:text-cyan-100'
                    : 'hover:bg-cyan-500/5 dark:hover:bg-[#0B223D]/50'
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key || col.header}
                    className={`py-3.5 px-4 ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#567285] dark:text-[#7F9BB2] px-1">
          <div>
            Showing{' '}
            <span className="font-bold text-[#08243D] dark:text-[#F0F9FF]">
              {(validCurrentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-[#08243D] dark:text-[#F0F9FF]">
              {Math.min(validCurrentPage * pageSize, sortedData.length)}
            </span>{' '}
            of{' '}
            <span className="font-bold text-[#08243D] dark:text-[#F0F9FF]">
              {sortedData.length}
            </span>{' '}
            records
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={validCurrentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="p-1.5 rounded-xl border border-cyan-500/20 bg-white/80 dark:bg-[#0B223D]/70 text-[#36566D] dark:text-[#B6C9D9] hover:bg-cyan-500/20 hover:text-cyan-700 dark:hover:text-cyan-200 hover:border-cyan-400/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={validCurrentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-xl border border-cyan-500/20 bg-white/80 dark:bg-[#0B223D]/70 text-[#36566D] dark:text-[#B6C9D9] hover:bg-cyan-500/20 hover:text-cyan-700 dark:hover:text-cyan-200 hover:border-cyan-400/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 font-semibold text-[#08243D] dark:text-[#F0F9FF]">
              Page {validCurrentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={validCurrentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-xl border border-cyan-500/20 bg-white/80 dark:bg-[#0B223D]/70 text-[#36566D] dark:text-[#B6C9D9] hover:bg-cyan-500/20 hover:text-cyan-700 dark:hover:text-cyan-200 hover:border-cyan-400/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={validCurrentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="p-1.5 rounded-xl border border-cyan-500/20 bg-white/80 dark:bg-[#0B223D]/70 text-[#36566D] dark:text-[#B6C9D9] hover:bg-cyan-500/20 hover:text-cyan-700 dark:hover:text-cyan-200 hover:border-cyan-400/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
