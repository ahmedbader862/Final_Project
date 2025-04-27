import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { db, collection, query, where, onSnapshot, doc, deleteDoc } from '../../firebase/firebase';
import { auth } from '../../firebase/firebase';
import Swal from 'sweetalert2';
import { ThemeContext } from "../../Context/ThemeContext";
import { useSelector } from "react-redux";
import { Package, Clock, CheckCircle, ShoppingBag, CreditCard, Calendar, Truck, MapPin, DollarSign } from 'lucide-react';
import './Order.css';

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

  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        Swal.fire({
          icon: 'error',
          title: text?.authenticationRequired || 'Authentication Required',
          text: text?.pleaseSignIn || 'Please sign in to view your orders.',
          background: theme === 'dark' ? '#212529' : '#dfdede',
          color: theme === 'dark' ? 'white' : '#333',
          confirmButtonColor: '#FF6B6B',
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
        setCurrentPage(1);
      }, (error) => {
        console.error("Error fetching orders:", error);
        Swal.fire({
          icon: 'error',
          title: text?.error || 'Error',
          text: text?.failedFetchOrders || 'Failed to fetch orders. Please try again.',
          background: theme === 'dark' ? '#212529' : '#dfdede',
          color: theme === 'dark' ? 'white' : '#333',
          confirmButtonColor: '#FF6B6B',
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

  const handleTrackOrder = (orderId, total) => {
    navigate('/track-order', { state: { orderId, total: parseFloat(total).toFixed(2) } });
  };

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

  const bgClass = theme === "dark" ? "bg-dark-custom" : "bg-light-custom";
  const cardClass = theme === "dark" ? "bg-dark-card text-white" : "bg-light-card text-dark";
  const textClass = theme === "dark" ? "text-white" : "text-dark";
  const buttonClass = theme === "dark" ? "btn-dark-custom" : "btn-light-custom";

  const extractIdPortion = (id) => {
    if (!id || typeof id !== 'string') return id || 'N/A';
    const hashIndex = id.indexOf('#');
    if (hashIndex === -1) return id;
    let firstUnderscore = id.indexOf('_', hashIndex);
    if (firstUnderscore === -1) return id.slice(hashIndex);
    let secondUnderscore = id.indexOf('_', firstUnderscore + 1);
    if (secondUnderscore === -1) return id.slice(hashIndex);
    return id.slice(hashIndex, secondUnderscore + 1);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending':
        return { icon: <Clock className="icon-sm" />, bg: 'bg-warning', text: 'text-warning' };
      case 'accepted':
        return { icon: <CheckCircle className="icon-sm" />, bg: 'bg-success', text: 'text-success' };
      default:
        return { icon: <Package className="icon-sm" />, bg: 'bg-primary', text: 'text-primary' };
    }
  };

  return (
    <div className={`orders-container py-5 ${bgClass}`}>
      <div className="container">
        <h2 className={`pt-4 pb-3 text-center h2 ${textClass}`}>
          {text?.myOrders || "My Orders"}
        </h2>

        <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
          <div className="dropdown">
            <button
              className={`btn ${buttonClass} dropdown-toggle`}
              type="button"
              data-bs-toggle="dropdown"
            >
              {text?.sort || "Sort"}: {sortOrder === "newest" ? (text?.sortNewest || "Newest First") : (text?.sortOldest || "Oldest First")}
            </button>
            <ul className={`dropdown-menu ${theme === "dark" ? "dropdown-menu-dark" : "dropdown-menu-light"}`}>
              <li><button className="dropdown-item" onClick={() => handleSortChange("newest")}>{text?.sortNewest || "Newest First"}</button></li>
              <li><button className="dropdown-item" onClick={() => handleSortChange("oldest")}>{text?.sortOldest || "Oldest First"}</button></li>
            </ul>
          </div>

          <div className="dropdown">
            <button
              className={`btn ${buttonClass} dropdown-toggle`}
              type="button"
              data-bs-toggle="dropdown"
            >
              {text?.status || "Status"}: {statusFilter === "all" ? (text?.statusAll || "All") : (text[`status${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`] || statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1))}
            </button>
            <ul className={`dropdown-menu ${theme === "dark" ? "dropdown-menu-dark" : "dropdown-menu-light"}`}>
              <li><button className="dropdown-item" onClick={() => handleStatusFilterChange("all")}>{text?.statusAll || "All"}</button></li>
              <li><button className="dropdown-item" onClick={() => handleStatusFilterChange("pending")}>{text?.statusPending || "Pending"}</button></li>
              <li><button className="dropdown-item" onClick={() => handleStatusFilterChange("accepted")}>{text?.statusAccepted || "Accepted"}</button></li>
            </ul>
          </div>

          <div className="dropdown">
            <button
              className={`btn ${buttonClass} dropdown-toggle`}
              type="button"
              data-bs-toggle="dropdown"
            >
              {text?.payment || "Payment"}: {paymentFilter === "all" ? (text?.paymentAll || "All") : paymentFilter === "cash_on_delivery" ? (text?.paymentCashOnDelivery || "Cash on Delivery") : (text?.paymentPaypal || "PayPal")}
            </button>
            <ul className={`dropdown-menu ${theme === "dark" ? "dropdown-menu-dark" : "dropdown-menu-light"}`}>
              <li><button className="dropdown-item" onClick={() => handlePaymentFilterChange("all")}>{text?.paymentAll || "All"}</button></li>
              <li><button className="dropdown-item" onClick={() => handlePaymentFilterChange("cash_on_delivery")}>{text?.paymentCashOnDelivery || "Cash on Delivery"}</button></li>
              <li><button className="dropdown-item" onClick={() => handlePaymentFilterChange("paypal")}>{text?.paymentPaypal || "PayPal"}</button></li>
            </ul>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className={`card text-center ${cardClass}`}>
            <div className="card-body">
              <p className={textClass}>{text?.noOrdersMatchFilters || "No orders match the selected filters."}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {currentOrders.map(order => {
                const statusStyles = getStatusStyles(order.status);
                return (
                  <div key={order.id} className="col-12 col-md-6 col-lg-4">
                    <div className={`card h-100 ${cardClass}`}>
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className={`card-title mb-0 ${textClass}`}>
                            {text?.order?.replace("{orderId}", extractIdPortion(order.id)) || `Order ${extractIdPortion(order.id)}`}
                          </h5>
                          <span className={`badge ${statusStyles.bg} text-white d-flex align-items-center gap-1`}>
                            {statusStyles.icon}
                            {text[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`] || order.status}
                          </span>
                        </div>
                        <hr className="border-secondary border-opacity-20" />
                        <div className="mb-3">
                          <h6 className={`card-subtitle mb-2 d-flex align-items-center gap-1 ${textClass}`}>
                            <ShoppingBag className="icon-sm" />
                            {text?.items || "Items"}
                          </h6>
                          <ul className="list-unstyled">
                            {Array.isArray(order.items) && order.items.map((item, index) => (
                              <li key={index} className="d-flex justify-content-between">
                                <span className="text-truncate">{item.title}</span>
                                <span>x{item.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <hr className="border-secondary border-opacity-20" />
                        <div className="mb-3">
                          <div className="payment-info mb-3 d-flex flex-row justify-content-between align-items-center">
                            <h6 className={`card-subtitle mb-0 d-flex align-items-center gap-1 ${textClass}`}>
                              <CreditCard className="icon-sm" />
                              {text?.payment || "Payment"}
                            </h6>
                            <p className={`mb-0 ${textClass}`}>
                              {order.paymentMethod === 'cash_on_delivery' ? (text?.paymentCashOnDelivery || "Cash on Delivery") : (text?.paymentPaypal || "PayPal")}
                            </p>
                          </div>
                          <div className="date-info mb-3 d-flex flex-row justify-content-between align-items-center">
                            <h6 className={`card-subtitle mb-0 d-flex align-items-center gap-1 ${textClass}`}>
                              <Calendar className="icon-sm" />
                              {text?.placed || "Placed"}
                            </h6>
                            <p className={`mb-0 ${textClass}`}>
                              {order.timestamp
                                ? new Date(order.timestamp.seconds ? order.timestamp.toDate() : order.timestamp).toLocaleString(currentLange === "Ar" ? 'ar-EG' : 'en-US', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="shipping-info mb-3 d-flex flex-row justify-content-between align-items-center">
                            <h6 className={`card-subtitle mb-0 d-flex align-items-center gap-1 ${textClass}`}>
                              <Truck className="icon-sm" />
                              {text?.trackingStatus || "Tracking Status"}
                            </h6>
                            <p className={`mb-0 ${textClass}`}>
                              {text[order.trackingStatus.split(" ").join("").toLowerCase()] || order.trackingStatus}
                            </p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <h6 className={`card-subtitle mb-2 d-flex align-items-center gap-1 ${textClass}`}>
                            <MapPin className="icon-sm" />
                            {text?.shippingDetails || "Shipping Details"}
                          </h6>
                          {order.shipping ? (
                            <div className={textClass}>
                              <p className="mb-1"><strong>{text?.city || "City"}:</strong> {order.shipping.city}</p>
                              <p className="mb-1"><strong>{text?.phone || "Phone"}:</strong> {order.shipping.phone}</p>
                              <p className="mb-0"><strong>{text?.details || "Details"}:</strong> {order.shipping.details}</p>
                            </div>
                          ) : (
                            <p className={`mb-0 ${textClass}`}>N/A</p>
                          )}
                        </div>
                        <hr className="border-secondary border-opacity-20" />
                        <div className="mb-3 d-flex flex-row justify-content-between align-items-center">
                          <h6 className={`card-subtitle mb-0 d-flex align-items-center gap-1 ${textClass}`}>
                            <DollarSign className="icon-sm" />
                            {order.paymentMethod === 'cash_on_delivery' ? (text?.totalDue || "Total Due") : (text?.totalPaid || "Total Paid")}
                          </h6>
                          <p className={`mb-0 text-lg fw-bold text-accent`}>
                            {parseFloat(order.total).toFixed(2)} LE
                          </p>
                        </div>
                        <button
                          className="btn btn-accent w-100 mt-auto d-flex align-items-center justify-content-center gap-2"
                          onClick={() => handleTrackOrder(order.id, order.total)}
                        >
                          <Truck className="icon-sm" />
                          {text?.trackOrder || "Track Order"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className={`page-link ${buttonClass}`}
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                      >
                        {text?.previous || "Previous"}
                      </button>
                    </li>
                    {getPageNumbers().map(number => (
                      <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button
                          className={`page-link ${buttonClass}`}
                          onClick={() => handlePageChange(number)}
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
                      >
                        {text?.next || "Next"}
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;