import { useState, useMemo } from 'react';

/**
 * Custom hook for pagination
 * @param {Array} items - Items to paginate
 * @param {Number} itemsPerPage - Items per page (default: 10)
 * @returns {Object} - Pagination state and controls
 */
export const usePagination = (items = [], itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const paginationData = useMemo(() => {
        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentItems = items.slice(startIndex, endIndex);

        return {
            currentItems,
            currentPage,
            totalPages,
            totalItems,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
            startIndex: startIndex + 1,
            endIndex: Math.min(endIndex, totalItems),
        };
    }, [items, currentPage, itemsPerPage]);

    const goToPage = (page) => {
        const totalPages = Math.ceil(items.length / itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Scroll to top of list
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const nextPage = () => {
        if (paginationData.hasNextPage) {
            goToPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (paginationData.hasPrevPage) {
            goToPage(currentPage - 1);
        }
    };

    const reset = () => {
        setCurrentPage(1);
    };

    return {
        ...paginationData,
        goToPage,
        nextPage,
        prevPage,
        reset,
    };
};
