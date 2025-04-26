import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import OrderCard from './OrderCard';

const OrdersList = ({ orders, updateStatus, updateTrackingStatus, deleteOrder }) => {
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <>
      <div className="row">
        {currentOrders.map((order) => (
          <div className="col-md-6" key={order.id}>
            <OrderCard
              order={order}
              updateStatus={updateStatus}
              updateTrackingStatus={updateTrackingStatus}
              deleteOrder={deleteOrder}
            />
          </div>
        ))}
      </div>
      {/* Pagination */}
      {orders.length > 0 && (
        <div className="d-flex justify-content-center mt-5">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link bg-dark text-white"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  style={{ borderRadius: '50px', margin: '0 5px' }}
                >
                  {text.previous}
                </button>
              </li>
              {getPageNumbers().map((number) => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <button
                    className="page-link bg-dark text-white"
                    onClick={() => handlePageChange(number)}
                    style={{
                      borderRadius: '50px',
                      margin: '0 5px',
                      backgroundColor: currentPage === number ? '#555' : '',
                      border: 'none',
                    }}
                  >
                    {number}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link bg-dark text-white"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  style={{ borderRadius: '50px', margin: '0 5px' }}
                >
                  {text.next}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default OrdersList;