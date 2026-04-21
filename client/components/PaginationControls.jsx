import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination Controls Component
 */
const PaginationControls = ({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    onPrevPage,
    onNextPage,
    onGoToPage,
    disabled = false,
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            {/* Info */}
            <div className="text-sm text-gray-400">
                Showing <span className="font-semibold text-white">{startIndex}</span> to{' '}
                <span className="font-semibold text-white">{endIndex}</span> of{' '}
                <span className="font-semibold text-white">{totalItems}</span> items
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={onPrevPage}
                    disabled={disabled || currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition-all duration-200"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                            // Show first page, last page, current page, and pages around current
                            if (page === 1 || page === totalPages || page === currentPage) return true;
                            if (page === currentPage - 1 || page === currentPage + 1) return true;
                            return false;
                        })
                        .map((page, idx, arr) => (
                            <React.Fragment key={page}>
                                {/* Add ellipsis if there's a gap */}
                                {idx > 0 && arr[idx - 1] !== page - 1 && (
                                    <span className="px-2 py-2 text-xs text-gray-500">...</span>
                                )}
                                <button
                                    onClick={() => onGoToPage(page)}
                                    disabled={disabled}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${page === currentPage
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                                        }`}
                                >
                                    {page}
                                </button>
                            </React.Fragment>
                        ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={onNextPage}
                    disabled={disabled || currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition-all duration-200"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default PaginationControls;
