import React, { useState, useEffect } from "react";
import { db, collection, query, where, onSnapshot, doc, deleteDoc } from '../../firebase/firebase';
import Swal from 'sweetalert2'; // Import SweetAlert2

const OrderTracking = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "orders"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(userOrders);
    }, (error) => {
      console.error("Error fetching orders:", error);
    });

    return () => unsubscribe();
  }, [userId]);

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
        return "bg-info";
      case "Processing":
        return "bg-warning";
      case "Shipped":
        return "bg-primary";
      case "Out for Delivery":
        return "bg-success";
      case "Delivered":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  // Delete individual order
  const handleDeleteOrder = async (orderId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete Order #${orderId}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
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

  // Clear all orders
  const handleClearAllOrders = async () => {
    if (orders.length === 0) return;

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
          Swal.fire(
            'Deleted!',
            'All your orders have been deleted.',
            'success'
          );
        } catch (error) {
          console.error("Error clearing all orders:", error);
          Swal.fire(
            'Error!',
            'There was an error deleting all orders.',
            'error'
          );
        }
      }
    });
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white mb-4">Order Tracking</h2>
        {orders.length > 0 && (
          <button 
            className="btn btn-danger btn-sm" 
            onClick={handleClearAllOrders}
          >
            <i className="bi bi-trash me-2"></i>Clear All Orders
          </button>
        )}
      </div>
      {orders.length === 0 ? (
        <p className="text-white">No orders found.</p>
      ) : (
        <div className="row g-4"> 
          {orders.map(order => (
            <div className="col-12 col-md-6 col-lg-4" key={order.id}> 
              <div className="card h-100"> 
                <div className="card-body">
                  <h5 className="card-title">Order #{order.id}</h5>
                  <p className="card-text">
                    <strong>Items:</strong> {order.items}<br />
                    <strong>Total:</strong> {order.total}<br />
                    <strong>Status:</strong> {order.status}<br />
                    <strong>Placed:</strong> {new Date(order.timestamp).toLocaleString()}<br />
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
                      <strong>Shipping Details:</strong>
                      <p className="ms-3">
                        City: {order.shipping.city}<br />
                        Phone: {order.shipping.phone}<br />
                        Details: {order.shipping.details}
                      </p>
                    </div>
                  )}
                  <button 
                    className="btn btn-danger btn-sm mt-3"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    <i className="bi bi-trash me-2"></i>Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;