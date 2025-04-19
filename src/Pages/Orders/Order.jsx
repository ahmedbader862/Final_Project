import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { db, collection, query, where, onSnapshot, doc, deleteDoc } from '../../firebase/firebase';
import { auth } from '../../firebase/firebase';
import Swal from 'sweetalert2';
import './Order.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "pending", "accepted"
  const [paymentFilter, setPaymentFilter] = useState("all"); // "all", "cash_on_delivery", "paypal"

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please sign in to view your orders.',
      });
      navigate('/signin');
      return;
    }

    const userId = currentUser.uid;
    const q = query(collection(db, "orders"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userOrders = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(order => order.status !== "rejected");

      setOrders(userOrders);
      applyFilters(userOrders, sortOrder, statusFilter, paymentFilter);
    }, (error) => {
      console.error("Error fetching orders:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch orders. Please try again.',
      });
    });

    return () => unsubscribe();
  }, [navigate]);

  const applyFilters = (ordersToFilter, sort, status, payment) => {
    let filtered = [...ordersToFilter];

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter(order => order.status === status);
    }

    // Filter by payment method
    if (payment !== "all") {
      filtered = filtered.filter(order => order.paymentMethod === payment);
    }

    // Sort by date
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
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    applyFilters(orders, sortOrder, newStatus, paymentFilter);
  };

  const handlePaymentFilterChange = (newPayment) => {
    setPaymentFilter(newPayment);
    applyFilters(orders, sortOrder, statusFilter, newPayment);
  };

  const handleDeleteOrder = async (orderId) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `You are about to delete Order #${orderId}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B73E3E',
      cancelButtonColor: '#4A919E',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const orderRef = doc(db, "orders", orderId);
          await deleteDoc(orderRef);
          Swal.fire('Deleted!', `Order #${orderId} has been deleted.`, 'success');
        } catch (error) {
          console.error("Error deleting order:", error);
          Swal.fire('Error!', 'There was an error deleting the order.', 'error');
        }
      }
    });
  };

  const handleTrackOrder = (orderId, total) => {
    navigate('/track-order', { state: { orderId, total: parseFloat(total).toFixed(2) } });
  };

  return (
    <div className="orders-container mt-5 mb-5">
      <div className="container">
        <h2 className="text-white mb-4 text-center">My Orders</h2>
        <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
          {/* Sort Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-outline-light dropdown-toggle"
              type="button"
              id="sortDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sort: {sortOrder === "newest" ? "Newest First" : "Oldest First"}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="sortDropdown">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleSortChange("newest")}
                >
                  Newest First
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleSortChange("oldest")}
                >
                  Oldest First
                </button>
              </li>
            </ul>
          </div>

          {/* Status Filter Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-outline-light dropdown-toggle"
              type="button"
              id="statusDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="statusDropdown">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleStatusFilterChange("all")}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleStatusFilterChange("pending")}
                >
                  Pending
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleStatusFilterChange("accepted")}
                >
                  Accepted
                </button>
              </li>
            </ul>
          </div>

          {/* Payment Method Filter Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-outline-light dropdown-toggle"
              type="button"
              id="paymentDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Payment: {paymentFilter === "all" ? "All" : paymentFilter === "cash_on_delivery" ? "Cash on Delivery" : "PayPal"}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="paymentDropdown">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handlePaymentFilterChange("all")}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handlePaymentFilterChange("cash_on_delivery")}
                >
                  Cash on Delivery
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handlePaymentFilterChange("paypal")}
                >
                  PayPal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-white text-center">No orders match the selected filters.</p>
        ) : (
          <div className="row justify-content-center g-4">
            {filteredOrders.map(order => (
              <div className="col-12 col-md-6 col-lg-4" key={order.id}>
                <div className="order-card h-100">
                  <div className="card-body">
                    <h5 className="card-title-order text-white">Order #{order.id}</h5>
                    <div className="card-text">
                      <strong className="text-muted">Items:</strong>
                      <ul className="item-list">
                        {Array.isArray(order.items) && order.items.map((item, index) => (
                          <li key={index}>
                            {item.title} (x{item.quantity}) - {item.total.toFixed(2)} LE
                          </li>
                        ))}
                      </ul>
                      <p className="text-white text-break">
                        <strong>{order.paymentMethod === 'cash_on_delivery' ? 'Total Due' : 'Total Paid'}:</strong> {parseFloat(order.total).toFixed(2)} LE<br />
                        <strong>Status:</strong> {order.status}<br />
                        <strong>Placed:</strong>{' '}
                        {order.timestamp
                          ? new Date(order.timestamp.seconds ? order.timestamp.toDate() : order.timestamp).toLocaleString('en-US', {
                              month: '2-digit',
                              day: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'N/A'}<br />
                        <strong>Tracking Status:</strong> {order.trackingStatus}
                      </p>
                      {order.shipping && (
                        <div>
                          <strong className="text-muted">Shipping Details:</strong>
                          <p className="ms-3 text-white text-break">
                            City: {order.shipping.city}<br />
                            Phone: {order.shipping.phone}<br />
                            Details: {order.shipping.details}
                          </p>
                        </div>
                      )}
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        <button 
                          className="btn btn-primary-custom btn-sm"
                          onClick={() => handleTrackOrder(order.id, order.total)}
                        >
                          <i className="bi bi-truck me-2"></i>Track Order
                        </button>
                        <button 
                          className="btn btn-danger-custom btn-sm"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <i className="bi bi-trash me-2"></i>Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
