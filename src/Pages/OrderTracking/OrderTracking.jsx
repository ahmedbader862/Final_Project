import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { db, doc, onSnapshot, deleteDoc } from '../../firebase/firebase';
import Swal from 'sweetalert2';
import './OrderTracking.css';

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const statuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered"
    ];
    const index = statuses.indexOf(status);
    return ((index + 1) / statuses.length) * 100;
  };

  const getProgressBarColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-order-placed";
      case "Processing":
        return "bg-processing";
      case "Shipped":
        return "bg-shipped";
      case "Out for Delivery":
        return "bg-out-for-delivery";
      case "Delivered":
        return "bg-delivered";
      default:
        return "bg-default";
    }
  };

  const handleDeleteOrder = async () => {
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
          Swal.fire(
            'Deleted!',
            `Order #${orderId} has been deleted.`,
            'success'
          );
          navigate('/orders'); // Redirect to orders page after deletion
        } catch (error) {
          console.error("Error deleting order:", error);
          Swal.fire(
            'Error!',
            'There was an error deleting the order.',
            'error'
          );
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

  if (!order) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="order-tracking-container mt-5 mb-5">
      <h2 className="text-white mb-4 text-center">Track Order #{orderId}</h2>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="order-card">
            <div className="card-body">
              <div className="card-text">
                <strong className="text-muted">Items:</strong>
                <ul className="item-list">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.title} (x{item.quantity}) - {item.total.toFixed(2)} LE
                    </li>
                  ))}
                </ul>
                <p className="text-white">
                  <strong>{order.paymentMethod === 'cash_on_delivery' ? 'Total Due' : 'Total Paid'}:</strong> {total || parseFloat(order.total).toFixed(2)} LE<br />
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
                <div className="progress mb-3" style={{ height: '20px' }}>
                  <div
                    className={`progress-bar ${getProgressBarColor(order.trackingStatus)}`}
                    role="progressbar"
                    style={{ width: `${getTrackingProgress(order.trackingStatus)}%` }}
                    aria-valuenow={getTrackingProgress(order.trackingStatus)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {order.trackingStatus}
                  </div>
                </div>
                {order.shipping && (
                  <div>
                    <strong className="text-muted">Shipping Details:</strong>
                    <p className="ms-3 text-white">
                      City: {order.shipping.city}<br />
                      Phone: {order.shipping.phone}<br />
                      Details: {order.shipping.details}
                    </p>
                  </div>
                )}
                <button 
                  className="btn btn-danger-custom btn-sm mt-3"
                  onClick={handleDeleteOrder}
                >
                  <i className="bi bi-trash me-2"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
