import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { db, collection, query, where, onSnapshot, doc, deleteDoc } from '../../firebase/firebase';
import { auth } from '../../firebase/firebase';
import Swal from 'sweetalert2';
import './Order.css';
import { ThemeContext } from "../../Context/ThemeContext";
import { useSelector } from "react-redux";

const Orders = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  // Access translations from Redux
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        Swal.fire({
          icon: 'error',
          title: text?.authenticationRequired || 'Authentication Required',
          text: text?.pleaseSignIn || 'Please sign in to view your orders.',
        });
        navigate('/signin');
        return;
      }

      const userId = user.uid;
      const q = query(collection(db, "orders"), where("userId", "==", userId));

      const unsubscribeOrders = onSnapshot(q, (snapshot) => {
        const userOrders = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(order => order.status !== "rejected");

        setOrders(userOrders);
        applyFilters(userOrders, sortOrder, statusFilter, paymentFilter);
        setCurrentPage(1); // Reset to first page when filters change
      }, (error) => {
        console.error("Error fetching orders:", error);
        Swal.fire({
          icon: 'error',
          title: text?.error || 'Error',
          text: text?.failedFetchOrders || 'Failed to fetch orders. Please try again.',
        });
      });

      return () => unsubscribeOrders();
    });

    return () => unsubscribeAuth();
  }, [navigate, text]);

  const applyFilters = (ordersToFilter, sort, status, payment) => {
    let filtered = [...ordersToFilter];

    if (status !== "all") {
      filtered = filtered.filter(order => order.status === status);
    }

    if (payment !== "all") {
      filtered = filtered.filter(order => order.paymentMethod === payment);
    }

    filtered.sort((a, b) => {
      const dateA = a.timestamp?.seconds ? a.timestamp.toDate() : new Date(a.timestamp);
      const dateB = b.timestamp?.seconds ? b.timestamp.toDate() : new Date(b.timestamp);
      return sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(filtered);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    applyFilters(orders, newSortOrder, statusFilter, paymentFilter);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    applyFilters(orders, sortOrder, newStatus, paymentFilter);
    setCurrentPage(1);
  };

  const handlePaymentFilterChange = (newPayment) => {
    setPaymentFilter(newPayment);
    applyFilters(orders, sortOrder, statusFilter, newPayment);
    setCurrentPage(1);
  };

  const handleDeleteOrder = async (orderId) => {
    Swal.fire({
      title: text?.deleteOrderConfirmTitle || 'Are you sure?',
      text: text?.deleteOrderConfirmText?.replace("{orderId}", orderId) || `You are about to delete Order #${orderId}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B73E3E',
      cancelButtonColor: '#4A919E',
      confirmButtonText: text?.deleteOrderConfirmButton || 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const orderRef = doc(db, "orders", orderId);
          await deleteDoc(orderRef);
          Swal.fire(
            text?.deleteOrderSuccessTitle || 'Deleted!',
            text?.deleteOrderSuccessMessage?.replace("{orderId}", orderId) || `Order #${orderId} has been deleted.`,
            'success'
          );
        } catch (error) {
          console.error("Error deleting order:", error);
          Swal.fire(
            text?.error || 'Error!',
            text?.deleteOrderError || 'There was an error deleting the order.',
            'error'
          );
        }
      }
    });
  };

  const handleTrackOrder = (orderId, total) => {
    navigate('/track-order', { state: { orderId, total: parseFloat(total).toFixed(2) } });
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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

  const bgClass = theme === "dark" ? "bg-custom-dark" : "bg-light";
  const textClass = theme === "dark" ? "text-white" : "text-dark";
  const buttonClass = theme === "dark" ? "bg-dark text-white" : "bg-light text-dark";

  return (
    <div className={`orders-container py-5 ${bgClass}`}>
      <div className="container">
        <h2 className={`pt-5 pb-4 text-center ${textClass}`}>
          {text?.myOrders || "My Orders"}
        </h2>

        <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
          {/* Sort Dropdown */}
          <div className="dropdown">
            <button
              className={`btn dropdown-toggle ${theme === "dark" ? "btn-outline-light" : "btn-outline-dark"}`}
              type="button"
              data-bs-toggle="dropdown"
            >
              {text?.sort || "Sort"}: {sortOrder === "newest" ? (text?.sortNewest || "Newest First") : (text?.sortOldest || "Oldest First")}
            </button>
            <ul className={`dropdown-menu ${theme === "dark" ? "dropdown-menu-dark" : ""}`}>
              <li><button className="dropdown-item" onClick={() => handleSortChange("newest")}>{text?.sortNewest || "Newest First"}</button></li>
              <li><button className="dropdown-item" onClick={() => handleSortChange("oldest")}>{text?.sortOldest || "Oldest First"}</button></li>
            </ul>
          </div>

          {/* Status Filter Dropdown */}
          <div className="dropdown">
            <button
              className={`btn dropdown-toggle ${theme === "dark" ? "btn-outline-light" : "btn-outline-dark"}`}
              type="button"
              data-bs-toggle="dropdown"
            >
              {text?.status || "Status"}: {statusFilter === "all" ? (text?.statusAll || "All") : (text[`status${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`] || statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1))}
            </button>
            <ul className={`dropdown-menu ${theme === "dark" ? "dropdown-menu-dark" : ""}`}>
              <li><button className="dropdown-item" onClick={() => handleStatusFilterChange("all")}>{text?.statusAll || "All"}</button></li>
              <li><button className="dropdown-item" onClick={() => handleStatusFilterChange("pending")}>{text?.statusPending || "Pending"}</button></li>
              <li><button className="dropdown-item" onClick={() => handleStatusFilterChange("accepted")}>{text?.statusAccepted || "Accepted"}</button></li>
            </ul>
          </div>

          {/* Payment Filter Dropdown */}
          <div className="dropdown">
            <button
              className={`btn dropdown-toggle ${theme === "dark" ? "btn-outline-light" : "btn-outline-dark"}`}
              type="button"
              data-bs-toggle="dropdown"
            >
              {text?.payment || "Payment"}: {paymentFilter === "all" ? (text?.paymentAll || "All") : paymentFilter === "cash_on_delivery" ? (text?.paymentCashOnDelivery || "Cash on Delivery") : (text?.paymentPaypal || "PayPal")}
            </button>
            <ul className={`dropdown-menu ${theme === "dark" ? "dropdown-menu-dark" : ""}`}>
              <li><button className="dropdown-item" onClick={() => handlePaymentFilterChange("all")}>{text?.paymentAll || "All"}</button></li>
              <li><button className="dropdown-item" onClick={() => handlePaymentFilterChange("cash_on_delivery")}>{text?.paymentCashOnDelivery || "Cash on Delivery"}</button></li>
              <li><button className="dropdown-item" onClick={() => handlePaymentFilterChange("paypal")}>{text?.paymentPaypal || "PayPal"}</button></li>
            </ul>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <p className={`${textClass} text-center`}>{text?.noOrdersMatchFilters || "No orders match the selected filters."}</p>
        ) : (
          <>
            <div className="row justify-content-center g-4">
              {currentOrders.map(order => (
                <div className="col-12 col-md-6 col-lg-4" key={order.id}>
                  <div className={`tracking-card h-100 ${theme === "dark" ? "bg-custom-dark text-white" : "bg-white text-dark"}`}>
                    <div className="card-body">
                      <h5 className={`card-title-order ${textClass}`}>
                        {text?.order?.replace("{orderId}", order.id) || `Order #${order.id}`}
                      </h5>
                      <div className="card-text">
                        <strong className="text-muted">{text?.items || "Items"}:</strong>
                        <ul className="item-list">
                          {Array.isArray(order.items) && order.items.map((item, index) => (
                            <li key={index}>
                              {item.title} (x{item.quantity}) - {item.total.toFixed(2)} LE
                            </li>
                          ))}
                        </ul>
                        <p className={`text-break ${textClass}`}>
                          <strong>{order.paymentMethod === 'cash_on_delivery' ? (text?.totalDue || "Total Due") : (text?.totalPaid || "Total Paid")}:</strong> {parseFloat(order.total).toFixed(2)} LE<br />
                          <strong>{text?.status || "Status"}:</strong> {text[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`] || order.status}<br />
                          <strong>{text?.placed || "Placed"}:</strong> {
                            order.timestamp
                              ? new Date(order.timestamp.seconds ? order.timestamp.toDate() : order.timestamp).toLocaleString(currentLange === "Ar" ? 'ar-EG' : 'en-US', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'N/A'
                          }<br />
                          <strong>{text?.trackingStatus || "Tracking Status"}:</strong> {text[order.trackingStatus.split(" ").join("").toLowerCase()] || order.trackingStatus}
                        </p>
                        {order.shipping && (
                          <div>
                            <strong className="text-muted">{text?.shippingDetails || "Shipping Details"}:</strong>
                            <p className={`ms-3 text-break ${textClass}`}>
                              {text?.city || "City"}: {order.shipping.city}<br />
                              {text?.phone || "Phone"}: {order.shipping.phone}<br />
                              {text?.details || "Details"}: {order.shipping.details}
                            </p>
                          </div>
                        )}
                        <div className="d-flex flex-wrap gap-2 mt-3">
                          <button 
                            className="btn btn-primary-custom btn-sm"
                            onClick={() => handleTrackOrder(order.id, order.total)}
                          >
                            <i className="bi bi-truck me-2"></i>{text?.trackOrder || "Track Order"}
                          </button>
                          {/* <button 
                            className="btn btn-danger-custom btn-sm"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <i className="bi bi-trash me-2"></i>{text?.delete || "Delete"}
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-5">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className={`page-link ${buttonClass}`} 
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      style={{ borderRadius: '50px', margin: '0 5px' }}
                    >
                      {text?.previous || "Previous"}
                    </button>
                  </li>
                  {getPageNumbers().map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                      <button 
                        className={`page-link ${buttonClass}`} 
                        onClick={() => handlePageChange(number)}
                        style={{ 
                          borderRadius: '50px', 
                          margin: '0 5px',
                          backgroundColor: currentPage === number ? (theme === "dark" ? '#555' : '#ddd') : '',
                          border: 'none'
                        }}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className={`page-link ${buttonClass}`} 
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      style={{ borderRadius: '50px', margin: '0 5px' }}
                    >
                      {text?.next || "Next"}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;