import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { db, doc, onSnapshot, deleteDoc, auth } from '../../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";
import Swal from 'sweetalert2';
import './OrderTracking.css';
import { ThemeContext } from '../../Context/ThemeContext';
import { ShoppingBag, DollarSign, Package, Calendar, Truck, MapPin, Circle, CheckCircle2, Clock } from 'lucide-react';

// ProgressBar Component
const ProgressBar = ({ trackingStatus, theme }) => {
  const steps = [
    { status: "Order Placed", label: "Order Placed", icon: ShoppingBag },
    { status: "Processing", label: "Processing", icon: Clock },
    { status: "Out for Delivery", label: " On Delivery", icon: Truck },
    { status: "Delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(step => step.status === trackingStatus);
  const activeSteps = currentStepIndex >= 0 ? currentStepIndex + 1 : 0;

  return (
    <div className="row pt-5 d-flex justify-content-center">
      <div className="col-12">
        <ul id="progressbar" className={`text-center ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
          {steps.map((step, index) => (
            <li key={step.status} className={`step0 ${index < activeSteps ? 'active' : ''}`}>
              <span className="progress-icon">
                {index < activeSteps ? (
                  <CheckCircle2
                    className="icon-progress"
                    stroke={theme === 'dark' ? '#ffffff' : '#333333'}
                  />
                ) : (
                  <Circle
                    className="icon-progress"
                    stroke={theme === 'dark' ? '#ffffff' : '#333333'}
                  />
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="row justify-content-between top">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <div key={step.status} className="row d-flex justify-content-center align-items-center icon-content">
              <IconComponent
                className="icon"
                stroke={theme === 'dark' ? '#ffffff' : '#333333'}
              />
              <div className="d-flex flex-column">
                {step.label.split(' ').map((word, i) => (
                  <p
                    key={`${step.status}-${i}`}
                    className={`font-weight-bold mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
                  >
                    {word}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You must be logged in to track your order.',
          background: theme === 'dark' ? '#212529' : '#dfdede',
          color: theme === 'dark' ? 'white' : '#333',
          confirmButtonColor: '#FF6B6B',
        });
        navigate('/login');
        return;
      }

      if (!orderId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No order specified to track.',
          background: theme === 'dark' ? '#212529' : '#dfdede',
          color: theme === 'dark' ? 'white' : '#333',
          confirmButtonColor: '#FF6B6B',
        });
        navigate('/orders');
        return;
      }

      const orderRef = doc(db, "orders", orderId);
      const unsubscribeOrder = onSnapshot(orderRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status === "rejected") {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'This order has been rejected and cannot be tracked.',
              background: theme === 'dark' ? '#212529' : '#dfdede',
              color: theme === 'dark' ? 'white' : '#333',
              confirmButtonColor: '#FF6B6B',
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
            background: theme === 'dark' ? '#212529' : '#dfdede',
            color: theme === 'dark' ? 'white' : '#333',
            confirmButtonColor: '#FF6B6B',
          });
          navigate('/orders');
        }
      }, (error) => {
        console.error("Error fetching order:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch order. Please try again.',
          background: theme === 'dark' ? '#212529' : '#dfdede',
          color: theme === 'dark' ? 'white' : '#333',
          confirmButtonColor: '#FF6B6B',
        });
        setLoading(false);
      });

      return () => unsubscribeOrder();
    });

    return () => unsubscribeAuth();
  }, [orderId, navigate, total]);

  const handleDeleteOrder = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete Order ${extractIdPortion(orderId)}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B73E3E',
      cancelButtonColor: '#4A919E',
      confirmButtonText: 'Yes, delete it!',
      background: theme === 'dark' ? '#212529' : '#dfdede',
      color: theme === 'dark' ? 'white' : '#333',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const orderRef = doc(db, "orders", orderId);
          await deleteDoc(orderRef);
          Swal.fire({
            title: 'Deleted!',
            text: `Order ${extractIdPortion(orderId)} has been deleted.`,
            icon: 'success',
            background: theme === 'dark' ? '#212529' : '#dfdede',
            color: theme === 'dark' ? 'white' : '#333',
            confirmButtonColor: '#FF6B6B',
          });
          navigate('/orders');
        } catch (error) {
          console.error("Error deleting order:", error);
          Swal.fire({
            title: 'Error!',
            text: 'There was an error deleting the order.',
            icon: 'error',
            background: theme === 'dark' ? '#212529' : '#dfdede',
            color: theme === 'dark' ? 'white' : '#333',
            confirmButtonColor: '#FF6B6B',
          });
        }
      }
    });
  };

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

  const formatShippingDetails = (shipping) => {
    if (!shipping) return 'N/A';
    return `${shipping.city}, ${shipping.phone}, ${shipping.details}`;
  };

  if (loading) {
    return (
      <div className={`order-tracking-container py-5 text-center ${theme === 'dark' ? 'bg-dark-custom' : 'bg-light-custom'}`}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className={`mt-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className={`order-tracking-container py-5 ${theme === 'dark' ? 'bg-dark-custom' : 'bg-light-custom'}`}>
      <div className="container">
        <h2 className={`pt-4 pb-3 text-center h2 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
          Track Order {extractIdPortion(orderId)}
        </h2>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className={`card tracking-card ${theme === 'dark' ? 'bg-dark-card text-white' : 'bg-light-card text-dark'}`}>
              <div className="card-body d-flex flex-column">
                <div className="mb-3">
                  <h6 className={`card-subtitle mb-2 d-flex align-items-center gap-1 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    <ShoppingBag className="icon-sm" stroke={theme === 'dark' ? '#ffffff' : '#333333'} />
                    Items
                  </h6>
                  <ul className="list-unstyled ms-2">
                    {order.items?.map((item, index) => (
                      <li key={index} className="d-flex justify-content-between">
                        <span className="text-truncate">{item.title} (x{item.quantity})</span>
                        <span>{item.total?.toFixed(2)} LE</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <hr className="border-secondary border-opacity-20" />
                <div className="mb-3 d-flex justify-content-between align-items-center gap-2">
                  <h6 className={`card-subtitle mb-0 d-flex align-items-center gap-1 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    <DollarSign className="icon-sm" stroke={theme === 'dark' ? '#ffffff' : '#333333'} />
                    {order.paymentMethod === 'cash_on_delivery' ? 'Total Due' : 'Total Paid'}
                  </h6>
                  <p className={`mb-0 fw-bold ${theme === 'dark' ? 'text-accent' : 'text-accent'}`}>
                    {total || parseFloat(order.total).toFixed(2)} LE
                  </p>
                </div>
                <div className="mb-3 d-flex justify-content-between align-items-center gap-2">
                  <h6 className={`card-subtitle mb-0 d-flex align-items-center gap-1 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    <Package className="icon-sm" stroke={theme === 'dark' ? '#ffffff' : '#333333'} />
                    Status
                  </h6>
                  <p className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    {order.status}
                  </p>
                </div>
                <div className="mb-3 d-flex justify-content-between align-items-center gap-2">
                  <h6 className={`card-subtitle mb-0 d-flex align-items-center gap-1 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    <Calendar className="icon-sm" stroke={theme === 'dark' ? '#ffffff' : '#333333'} />
                    Placed
                  </h6>
                  <p className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    {order.timestamp
                      ? new Date(order.timestamp.seconds ? order.timestamp.toDate() : order.timestamp).toLocaleString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </p>
                </div>
                <div className="mb-3 d-flex justify-content-between align-items-center gap-2">
                  <h6 className={`card-subtitle mb-0 d-flex align-items-center gap-1 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    <Truck className="icon-sm" stroke={theme === 'dark' ? '#ffffff' : '#333333'} />
                    Tracking Status
                  </h6>
                  <p className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    {order.trackingStatus}
                  </p>
                </div>
                <ProgressBar trackingStatus={order.trackingStatus || "Order Placed"} theme={theme} />
                <hr className="border-secondary border-opacity-20" />
                <div className="mb-3 d-flex justify-content-between align-items-center gap-2">
                  <h6 className={`card-subtitle mb-0 d-flex align-items-center gap-1 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    <MapPin className="icon-sm" stroke={theme === 'dark' ? '#ffffff' : '#333333'} />
                    Shipping Details
                  </h6>
                  <p className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    {formatShippingDetails(order.shipping)}
                  </p>
                </div>
                <hr className="border-secondary border-opacity-20" />
                {/* <button
                  className="btn btn-danger-custom w-100 mt-auto d-flex align-items-center justify-content-center gap-2"
                  onClick={handleDeleteOrder}
                >
                  <i className="bi bi-trash icon-sm"></i>
                  Delete Order
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;