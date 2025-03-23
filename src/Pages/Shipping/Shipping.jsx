// src/Pages/Shipping/Shipping.js
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { db, doc, setDoc, collection, addDoc } from '../../firebase/firebase';

export default function Shipping() {
  const { state } = useLocation(); // Get cart details from navigation state
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false); // Control PayPal visibility

  // Extract cart details from navigation state
  const { cartItems, total, discountApplied, userId, customer } = state || {};

  // If no cart details are passed, redirect back to cart
  if (!cartItems || !total || !userId) {
    navigate('/cart');
    return null;
  }

  // Form validation schema using Yup
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
      setShowPayment(true); // Show PayPal buttons after form submission
    },
  });

  const paypalClientId = "AcsvtygcLDvhx31he8A2uov0YggkozkSZ3TomOH8PRclYHtxLoVJkcV9yu8hvPTpQDSpeeUpKIsbH0Az";

  return (
    <div className="container">
      <div className="mt-5 mb-5">
        {!showPayment ? (
          <form className="max-w-md mx-auto" onSubmit={formik.handleSubmit}>
            <div className="mb-4">
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
                className="form-control"
                placeholder="Enter your city"
              />
              {formik.errors.city && formik.touched.city && (
                <div className="alert alert-danger mt-2" role="alert">
                  {formik.errors.city}
                </div>
              )}
            </div>

            <div className="mb-4">
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
                className="form-control"
                placeholder="e.g., Apartment number, street"
              />
              {formik.errors.details && formik.touched.details && (
                <div className="alert alert-danger mt-2" role="alert">
                  {formik.errors.details}
                </div>
              )}
            </div>

            <div className="mb-4">
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
                className="form-control"
                placeholder="Enter your phone number"
              />
              {formik.errors.phone && formik.touched.phone && (
                <div className="alert alert-danger mt-2" role="alert">
                  {formik.errors.phone}
                </div>
              )}
            </div>

            <button type="submit" className="btn clr text-white w-100">
              Proceed to Payment
            </button>
          </form>
        ) : (
          <div className="max-w-md mx-auto">
            <h3 className="mb-3">Complete Your Payment</h3>
            <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD" }}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: total, // Use the total passed from Cart
                          currency_code: "USD",
                        },
                        description: "Restaurant Cart Purchase",
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  const order = await actions.order.capture();
                  console.log("Payment successful:", order);

                  // Prepare order details including shipping info
                  const orderDetails = {
                    customer,
                    items: cartItems.map(item => `${item.title} (${item.quantity})`).join(", "),
                    total: `${total} LE`,
                    status: "pending",
                    timestamp: new Date().toISOString(),
                    userId,
                    shipping: {
                      city: formik.values.city,
                      phone: formik.values.phone,
                      details: formik.values.details,
                    },
                    discountApplied,
                  };

                  // Save order to Firebase
                  const ordersCollection = collection(db, "orders");
                  const docRef = await addDoc(ordersCollection, orderDetails);
                  const orderId = docRef.id;

                  // Clear cart after successful payment
                  const cartDocRef = doc(db, "users2", userId);
                  await setDoc(cartDocRef, { cartItems: [] }, { merge: true });

                  alert("Order placed successfully!");
                  navigate('/order-confirmation', { state: { total, orderId } });
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  alert("An error occurred during payment. Please try again.");
                }}
              />
            </PayPalScriptProvider>
          </div>
        )}
      </div>
    </div>
  );
}