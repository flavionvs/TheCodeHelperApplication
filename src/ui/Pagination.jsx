import React, { useState, useEffect } from "react";

const Pagination = ({ totalPages = 50,from,to,total, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
useEffect(() => {
  if (typeof onPageChange === "function") {
    onPageChange(currentPage);
  }
}, [currentPage, onPageChange]);
  const generatePages = () => {
    let pages = [];
    if (totalPages <= 7) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 4) {
        pages = [1, 2, 3, 4, "...", totalPages - 1, totalPages];
      } else if (currentPage >= totalPages - 3) {
        pages = [1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, 2, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages - 1, totalPages];
      }
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      <p>
        Showing <span>{from}</span> to <span>{to}</span> of <span>{total}</span> entries
      </p>

      <ul className="pagination">
        <li>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            « Prev
          </button>
        </li>

        {generatePages().map((page, index) =>
          page === "..." ? (
            <li key={index} className="dots">...</li>
          ) : (
            <li key={index}>
              <button
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            </li>
          )
        )}

        <li>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next »
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
