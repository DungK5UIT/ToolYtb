import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4 text-gray-400">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 text-sm font-medium bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
      >
        <ChevronLeftIcon className="h-5 w-5 mr-2" />
        Trang trước
      </button>
      
      <span className="text-sm font-semibold">
        Trang {currentPage} / {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 text-sm font-medium bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
      >
        Trang sau
        <ChevronRightIcon className="h-5 w-5 ml-2" />
      </button>
    </div>
  );
};

export default Pagination;