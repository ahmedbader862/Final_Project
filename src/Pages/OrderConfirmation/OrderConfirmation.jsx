import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, doc, onSnapshot } from '../../firebase/firebase'; // Import Firebase utilities
import './OrderConfirmation.css'; // Optional: Add custom styling

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get total and orderId from location state
  const { total = '0.00', orderId } = location.state || {};
  const [orderStatus, setOrderStatus] = useState('pending'); // Default to pending
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (!orderId) {
      console.error("No order ID provided");
      setLoading(false);
      return;
    }

    // Listen to the order status in real-time
    const orderRef = doc(db, "orders", orderId);
    const unsubscribe = onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOrderStatus(data.status);
        setLoading(false);
      } else {
        console.error("Order not found");
        setLoading(false);
      }
    }, (error) => {
      console.error("Error fetching order status:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [orderId]);

  const handleReturnHome = () => {
    navigate('/');
  };

  // Render content based on order status
  const renderContent = () => {
    if (loading) {
      return <p className="lead mb-4">Loading order status...</p>;
    }

    switch (orderStatus) {
      case 'pending':
        return (
          <>
            <h2 className="fw-bold mb-4 text-warning">Order Pending</h2>
            <p className="lead mb-4">
              Your order has been received and is awaiting approval. Please check back later.
            </p>
          </>
        );
      case 'accepted':
        return (
          <>
            <h2 className="fw-bold mb-4 text-success">Order Confirmed!</h2>
            <p className="lead mb-4">
              Thank you for your purchase! Your payment has been successfully processed.
            </p>
          </>
        );
      case 'rejected':
        return (
          <>
            <h2 className="fw-bold mb-4 text-danger">Order Rejected</h2>
            <p className="lead mb-4">
              Unfortunately, your order has been rejected. Your money is being refunded as soon as possible.
            </p>
          </>
        );
      default:
        return <p className="lead mb-4">Unknown order status. Please contact support.</p>;
    }
  };

  return (
    <section className="h-100 mt-5">
      <div className="container h-100 py-5">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-10">
            <div className="card rounded-3 mb-4">
              <div className="card-body p-4 text-center">
                {renderContent()}

                <div className="mb-4">
                  <h5>Order Summary</h5>
                  <p className="mb-1">Total Paid: {total} LE</p>
                  <p className="text-muted">
                    {orderStatus === 'accepted' 
                      ? "You'll receive a confirmation email shortly." 
                      : "Status updates will be reflected here."}
                  </p>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleReturnHome}
                  >
                    Return to Home
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() => navigate('/contactus')}
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}