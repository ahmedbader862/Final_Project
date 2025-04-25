import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, doc, onSnapshot } from '../../firebase/firebase';
import { toast } from 'react-toastify';
import './OrderConfirmation.css';
import { ThemeContext } from '../../Context/ThemeContext';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  const { orderId } = location.state || {};
  const [orderData, setOrderData] = useState({ total: '0.00', status: 'pending', paymentMethod: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      console.error("No order ID provided");
      toast.error("No order found. Redirecting to homepage...");
      navigate('/');
      return;
    }

    const orderRef = doc(db, "orders", orderId);
    const unsubscribe = onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOrderData({
          total: data.total.toFixed(2),
          status: data.status,
          paymentMethod: data.paymentMethod || '',
        });
        setLoading(false);
      } else {
        console.error("Order not found");
        toast.error("Order not found. Redirecting to homepage...");
        navigate('/');
      }
    }, (error) => {
      console.error("Error fetching order status:", error);
      toast.error("Error fetching order status. Please try again later.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId, navigate]);

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleTrackOrder = () => {
    navigate('/track-order', { state: { total: orderData.total, orderId } });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="lead mb-4">Loading order status...</p>
        </div>
      );
    }

    switch (orderData.status) {
      case 'pending':
        return (
          <>
            <h2 className="fw-bold mb-4 ">Order Pending</h2>
            <p className="lead mb-4 text-muted ">
              Your order has been received and is awaiting approval. Please check back later.
            </p>
          </>
        );
      case 'accepted':
        return (
          <>
            <h2 className="fw-bold mb-4 text-success">Order Confirmed!</h2>
            <p className="lead mb-4 text-muted">
              Thank you for your purchase! Your payment has been successfully processed.
            </p>
          </>
        );
      case 'rejected':
        return (
          <>
            <h2 className="fw-bold mb-4 text-danger">Order Rejected</h2>
            <p className="lead mb-4 text-muted">
              Unfortunately, your order has been rejected.
              {orderData.paymentMethod === 'paypal' && (
                <> Your money will be refunded to your PayPal account as soon as possible.</>
              )}
            </p>
          </>
        );
      default:
        return <p className="lead mb- text-muted">Unknown order status. Please contact support.</p>;
    }
  };

  return (
    <section className={`h-100 mt-5 order-confirmation ${theme}`}>
      <div className="container h-100 py-5">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-10">
            <div className="card rounded-3 mb-4">
              <div className="card-body p-4 text-center">
                {renderContent()}

                <div className="mb-4">
                  <h5 className='text-muted'>Order Summary</h5>
                  <p className='text-muted' >
                    {orderData.paymentMethod === 'cash_on_delivery' ? 'Total Due' : 'Total Paid'}: {orderData.total} LE
                  </p>
                  <p className="text-muted">
                    {orderData.status === 'accepted'
                      ? "You'll receive a confirmation email shortly."
                      : "Status updates will be reflected here."}
                  </p>
                </div>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleReturnHome}
                  >
                    Return to Home
                  </button>
                  {orderData.status === 'accepted' && (
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      onClick={handleTrackOrder}
                    >
                      Track Order
                    </button>
                  )}
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