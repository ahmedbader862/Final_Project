import React, { useState, useEffect, useContext } from 'react';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { db, doc, setDoc, onSnapshot } from '../../firebase/firebase';
import Swal from 'sweetalert2';
import CartItem from './CartItem';
import CouponSection from './CouponSection';
import CartSummary from './CartSummary';
import OrderButton from './OrderButton';
import { ThemeContext } from '../../Context/ThemeContext';

export default function Cart() {
  const { theme } = useContext(ThemeContext);
  const userState55 = useSelector((state) => state.UserData['UserState']);
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userState55?.uid) return;
    const docRef = doc(db, "users2", userState55.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        setCartItems(docSnap.exists() ? docSnap.data().cartItems || [] : []);
      },
      (error) => console.error("Error listening to cart updates:", error)
    );
    return () => unsubscribe();
  }, [userState55]);

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

  const calculateTotal = () =>
    discountApplied ? (parseFloat(calculateSubtotal()) * 0.8).toFixed(2) : calculateSubtotal();

  const calculateTotalPrice = (item) =>
    (item.price * item.quantity).toFixed(2);

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'iti20') {
      setDiscountApplied(true);
    } else {
      setDiscountApplied(false);
      Swal.fire({
        icon: 'error',
        title: "Invalid Coupon",
        text: "The coupon code you entered is invalid.",
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const updateCart = async (updatedCart) => {
    try {
      const docRef = doc(db, "users2", userState55.uid);
      await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleStepDown = (item) => {
    const updated = cartItems.map(cartItem =>
      cartItem.title === item.title && cartItem.quantity > 1
        ? { ...cartItem, quantity: cartItem.quantity - 1 }
        : cartItem
    );
    updateCart(updated);
  };

  const handleStepUp = (item) => {
    const updated = cartItems.map(cartItem =>
      cartItem.title === item.title
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    updateCart(updated);
  };

  const handleRemoveItem = (item) => {
    Swal.fire({
      title: "Remove Item",
      text: `Are you sure you want to remove "${item.title}" from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updated = cartItems.filter(cartItem => cartItem.title !== item.title);
        await updateCart(updated);
        Swal.fire({
          icon: 'success',
          title: "Removed!",
          text: `"${item.title}" has been removed from your cart.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleOrderNow = () => {
    if (cartItems.length === 0) {
      return Swal.fire({
        icon: 'warning',
        title: "Empty Cart",
        text: "Your cart is empty. Add items to proceed.",
        confirmButtonColor: '#3085d6',
      });
    }

    navigate('/shippingadress', {
      state: {
        cartItems,
        total: calculateTotal(),
        discountApplied,
        userId: userState55.uid,
        customer: userState55.displayName || userState55.email || "Anonymous",
      },
    });
  };

  const bgClass = theme === 'dark' ? 'bg-custom-dark text-white' : 'bg-custom-light text-dark';

  return (
    <section className={`min-vh-100 pt-5 ${bgClass} mt-5`}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              <h3 className="fw-bold mb-3">Your Cart</h3>
            </div>

            {cartItems.length > 0 ? (
              <>
                {cartItems.map(item => (
                  <CartItem
                    key={item.title}
                    item={item}
                    handleStepDown={handleStepDown}
                    handleStepUp={handleStepUp}
                    handleRemoveItem={handleRemoveItem}
                    calculateTotalPrice={calculateTotalPrice}
                    theme={theme}
                  />
                ))}

                <CouponSection
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  handleApplyCoupon={handleApplyCoupon}
                  cartItems={cartItems}
                  theme={theme}
                />

                <CartSummary
                  calculateSubtotal={calculateSubtotal}
                  calculateTotal={calculateTotal}
                  discountApplied={discountApplied}
                  theme={theme}
                />

                <OrderButton handleOrderNow={handleOrderNow} theme={theme} />
              </>
            ) : (
              <p className="text-center mt-4">Your cart is empty.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
