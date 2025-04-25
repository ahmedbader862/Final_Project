import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons, FUNDING } from '@paypal/react-paypal-js';
import { db, doc, setDoc } from '../../firebase/firebase';
import { Timestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Shipping.css';
import { ThemeContext } from '../../Context/ThemeContext';

export default function Shipping() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const { theme } = useContext(ThemeContext);

  const { cartItems, total, discountApplied, userId, customer, timestamp } = state || {};

  if (!cartItems || !total || !userId) {
    toast.error('Invalid order. Please start from the cart.', {
      position: 'top-right',
      autoClose: 3000,
    });
    navigate('/cart');
    return null;
  }

  const validationSchema = Yup.object({
    city: Yup.string().required('City is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10,15}$/, 'Phone number must be between 10 and 15 digits')
      .required('Phone number is required'),
    details: Yup.string().required('Details are required'),
  });

  const formik = useFormik({
    initialValues: {
      city: '',
      phone: '',
      details: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Shipping Form Submitted:', values);
      setShowPayment(true);
    },
  });

  const paypalClientId = "AcsvtygcLDvhx31he8A2uov0YggkozkSZ3TomOH8PRclYHtxLoVJkcV9yu8hvPTpQDSpeeUpKIsbH0Az";

  const saveOrder = async (paymentMethod) => {
    try {
      const orderDetails = {
        id: `order_${Date.now().toString().slice(-6)}_${userId.slice(-6)}`,
        customer,
        items: cartItems.map(item => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        total: parseFloat(total),
        status: 'pending',
        trackingStatus: 'Order Placed',
        timestamp: timestamp ? Timestamp.fromDate(new Date(timestamp)) : Timestamp.now(),
        userId,
        shipping: {
          city: formik.values.city,
          phone: formik.values.phone,
          details: formik.values.details,
        },
        paymentMethod,
        discountApplied,
      };

      await setDoc(doc(db, 'orders', orderDetails.id), orderDetails);

      const cartDocRef = doc(db, 'users2', userId);
      await setDoc(cartDocRef, { cartItems: [] }, { merge: true });

      return orderDetails.id;
    } catch (error) {
      console.error('Order save error:', error);
      throw error;
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      const orderId = await saveOrder('cash_on_delivery');
      toast.success('Order placed successfully with Cash on Delivery!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/order-confirmation', { state: { total: parseFloat(total).toFixed(2), orderId } });
    } catch (error) {
      toast.error('An error occurred while processing your order. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Use the theme value directly as a class to match CSS selectors
  return (
    <div className={`shipping-wrapper ${theme}`}>
      <div className="shipping-container">
        {!showPayment ? (
          <form className="shipping-form" onSubmit={formik.handleSubmit}>
            <h3 className="form-title" >Shipping Information</h3>
            <div className="form-group">
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
                className="form-input"
                placeholder="Enter your city"
              />
              {formik.errors.city && formik.touched.city && (
                <div className="error-message" role="alert">
                  {formik.errors.city}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="details" className="form-label">
                Details
              </label>
              <input
                type="text"
                id="details"
                name="details"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.details}
                className="form-input"
                placeholder="e.g., Apartment number, street"
              />
              {formik.errors.details && formik.touched.details && (
                <div className="error-message" role="alert">
                  {formik.errors.details}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="form-input"
                placeholder="Enter your phone number"
              />
              {formik.errors.phone && formik.touched.phone && (
                <div className="error-message" role="alert">
                  {formik.errors.phone}
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn">
              Proceed to Payment
            </button>
          </form>
        ) : (
          <div className="payment-section">
            <h3 className="section-title mb-5">Choose Payment Method</h3>
            <div className="payment-options">
              <button
                className="payment-btn cod-btn"
                onClick={handleCashOnDelivery}
              >
                Cash on Delivery
              </button>

              <div className="payment-btn paypal-btn">
                <PayPalScriptProvider options={{ 'client-id': paypalClientId, currency: 'USD' }}>
                  <PayPalButtons
                    fundingSource={FUNDING.PAYPAL}
                    style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: parseFloat(total).toFixed(2),
                              currency_code: 'USD',
                            },
                            description: 'Restaurant Cart Purchase',
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        const order = await actions.order.capture();
                        console.log('Payment successful:', order);

                        const orderId = await saveOrder('paypal');
                        toast.success('Order placed successfully with PayPal!', {
                          position: 'top-right',
                          autoClose: 3000,
                        });
                        navigate('/order-confirmation', { state: { total: parseFloat(total).toFixed(2), orderId } });
                      } catch (error) {
                        console.error('PayPal order error:', error);
                        toast.error('An error occurred during payment. Please try again.', {
                          position: 'top-right',
                          autoClose: 3000,
                        });
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      toast.error('An error occurred during payment. Please try again.', {
                        position: 'top-right',
                        autoClose: 3000,
                      });
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}