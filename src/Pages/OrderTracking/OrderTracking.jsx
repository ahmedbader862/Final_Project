import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  db,
  doc,
  onSnapshot,
  deleteDoc
} from '../../firebase/firebase';
import { ThemeContext } from '../../Context/ThemeContext';
import './OrderTracking.css';

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-custom-dark" : "bg-light";

  useEffect(() => {
    if (!orderId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No order specified to track.',
      });
      navigate('/orders');
      return;
    }

    const orderRef = doc(db, "orders", orderId);
    const unsubscribe = onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === "rejected") {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'This order has been rejected and cannot be tracked.',
          });
          navigate('/order-confirmation', { state: { orderId, total } });
          return;
        }
        
        // Ensure order.items is always an array
        if (!Array.isArray(data.items)) {
          data.items = [];
        }

        setOrder(data);
        setLoading(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Order not found.',
        });
        navigate('/orders');
      }
    }, (error) => {
      console.error("Error fetching order:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch order. Please try again.',
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId, navigate, total]);

  const getTrackingProgress = (status) => {
    const statuses = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
    const index = statuses.indexOf(status);
    return ((index + 1) / statuses.length) * 100;
  };

  const getProgressBarColor = (status) => {
    switch (status) {
      case "Order Placed": return "bg-info";
      case "Processing": return "bg-warning";
      case "Shipped": return "bg-primary";
      case "Out for Delivery": return "bg-secondary";
      case "Delivered": return "bg-success";
      default: return "bg-secondary";
    }
  };

  const handleDeleteOrder = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete Order #${id}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B73E3E',
      cancelButtonColor: '#4A919E',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const orderRef = doc(db, "orders", id);
          await deleteDoc(orderRef);
          Swal.fire('Deleted!', `Order #${id} has been deleted.`, 'success');
          navigate('/orders');
        } catch (error) {
          console.error("Error deleting order:", error);
          Swal.fire('Error!', 'There was an error deleting the order.', 'error');
        }
      }
    });
  };

  const handleClearAllOrders = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to delete ALL your orders. This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete all!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deletePromises = orders.map(order => {
            const orderRef = doc(db, "orders", order.id);
            return deleteDoc(orderRef);
          });
          await Promise.all(deletePromises);
          Swal.fire('Deleted!', 'All your orders have been deleted.', 'success');
        } catch (error) {
          console.error("Error clearing all orders:", error);
          Swal.fire('Error!', 'There was an error deleting all orders.', 'error');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="order-tracking-container mt-5 mb-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-white mt-3">Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className={`Oreders min-vh-100 ${bgColor}`}>
      <div className="container mt-5">
        <h2 className="text-white text-center mb-4">Track Order #{orderId}</h2>
        <div className="order-card mb-5">
          <div className="card-body">
            <ul className="item-list">
              {/* Ensure we map over an array */}
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <li key={index}>
                    {item.title} (x{item.quantity}) - {item.total?.toFixed(2)} LE
                  </li>
                ))
              ) : (
                <li className="text-danger">No items found or invalid format.</li>
              )}
            </ul>

            <p className="text-white">
              <strong>{order.paymentMethod === 'cash_on_delivery' ? 'Total Due' : 'Total Paid'}:</strong> {total || parseFloat(order.total).toFixed(2)} LE<br />
              <strong>Status:</strong> {order.status}<br />
              <strong>Placed:</strong>{' '}
              {order.timestamp
                ? new Date(order.timestamp.seconds ? order.timestamp.toDate() : order.timestamp).toLocaleString()
                : 'N/A'}<br />
              <strong>Tracking Status:</strong> {order.trackingStatus}
            </p>

            <div className="progress mb-3" style={{ height: '20px' }}>
              <div
                className={`progress-bar ${getProgressBarColor(order.trackingStatus)}`}
                role="progressbar"
                style={{ width: `${getTrackingProgress(order.trackingStatus)}%` }}
              >
                {order.trackingStatus}
              </div>
            </div>

            {order.shipping && (
              <div className="text-white">
                <strong>Shipping:</strong>
                <p>
                  City: {order.shipping.city}<br />
                  Phone: {order.shipping.phone}<br />
                  Details: {order.shipping.details}
                </p>
              </div>
            )}

            <button
              className="btn btn-danger mt-3"
              onClick={() => handleDeleteOrder(orderId)}
            >
              <i className="bi bi-trash me-2"></i>Delete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
