import React, { useState, useEffect } from 'react';
import './Cart.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { db, doc, setDoc, onSnapshot } from '../../firebase/firebase';
import Swal from 'sweetalert2';

export default function Cart() {
  const userState55 = useSelector((state) => state.UserData['UserState']);
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userState55 && userState55.uid) {
      const docRef = doc(db, "users2", userState55.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Real-time cart data:", data.cartItems);
          setCartItems(data.cartItems || []);
        } else {
          console.log("No document found, cart is empty");
          setCartItems([]);
        }
      }, (error) => {
        console.error("Error listening to cart updates:", error);
      });

      return () => unsubscribe();
    }
  }, [userState55]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    if (discountApplied) {
      return (subtotal * 0.8).toFixed(2);
    }
    return subtotal;
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'iti20') {
      setDiscountApplied(true);
      console.log("20% discount applied");
    } else {
      setDiscountApplied(false);
      Swal.fire({
        icon: 'error',
        title: 'Invalid Coupon',
        text: 'The coupon code you entered is invalid.',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const handleStepDown = async (item) => {
    try {
      const docRef = doc(db, "users2", userState55.uid);
      const updatedCart = cartItems.map(cartItem => {
        if (cartItem.title === item.title && cartItem.quantity > 1) {
          return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
        return cartItem;
      });
      await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  const handleStepUp = async (item) => {
    try {
      const docRef = doc(db, "users2", userState55.uid);
      const updatedCart = cartItems.map(cartItem => {
        if (cartItem.title === item.title) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });
      await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const handleRemoveItem = async (item) => {
    Swal.fire({
      title: 'Remove Item',
      text: `Are you sure you want to remove "${item.title}" from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const docRef = doc(db, "users2", userState55.uid);
          const updatedCart = cartItems.filter(cartItem => cartItem.title !== item.title);
          await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
          
          Swal.fire({
            icon: 'success',
            title: 'Removed!',
            text: `"${item.title}" has been removed from your cart.`,
            showConfirmButton: false,
            timer: 1500
          });
        } catch (error) {
          console.error("Error removing item:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error removing the item from your cart.',
            confirmButtonColor: '#3085d6',
          });
        }
      }
    });
  };

  const calculateTotalPrice = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const handleOrderNow = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'Your cart is empty. Add items to proceed.',
        confirmButtonColor: '#3085d6',
      });
      return;
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

  return (
    <section className="h-100 mt-5">
      <div className="container h-100 py-5">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-normal mb-0 res ">Restaurant Cart</h3>
            </div>

            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div className="card rounded-3 mb-4" key={item.title}>
                  <div className="card-body p-4">
                    <div className="row d-flex justify-content-between align-items-center">
                      <div className="col-md-2 col-lg-2 col-xl-2">
                        <img
                          src={item.poster_path}
                          className="img-fluid rounded-3 food-image"
                          alt={item.title}
                        />
                      </div>
                      <div className="col-md-3 col-lg-3 col-xl-3">
                        <p className="lead fw-normal mb-2">{item.title}</p>
                        <p className="text-muted">Added to cart</p>
                      </div>
                      <div className="col-md-3 col-lg-3 col-xl-2 d-flex align-items-center">
                        <button className="btn btn-link px-2" onClick={() => handleStepDown(item)}>
                          <i className="bi bi-dash icon-visible"></i>
                        </button>
                        <input
                          min="1"
                          value={item.quantity}
                          type="number"
                          className="form-control form-control-sm"
                          readOnly
                        />
                        <button className="btn btn-link px-2" onClick={() => handleStepUp(item)}>
                          <i className="bi bi-plus icon-visible"></i>
                        </button>
                      </div>
                      <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                        <h5 className="mb-0">{calculateTotalPrice(item)} LE</h5>
                      </div>
                      <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                        <a className="text-danger" onClick={() => handleRemoveItem(item)}>
                          <i className="bi bi-trash3 icon-visible"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-white">Your cart is empty.</p>
            )}

            <div className="card mb-4">
              <div className="card-body p-4 d-flex flex-row">
                <div className="form-outline flex-fill">
                  <input 
                    type="text" 
                    id="discountCode" 
                    className="form-control form-control-lg "
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={cartItems.length === 0}
                  />
                  <label className="form-label badge bdg px-2 text-white  mt-1" htmlFor="discountCode">
                    Coupon Code
                  </label>
                </div>
                <button 
                  type="button" 
                  className="btn aclr btn-lg ms-3"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <p className="mb-0">Subtotal:</p>
                    <p className="mb-0">{calculateSubtotal()} LE</p>
                  </div>
                  {discountApplied && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <p className="mb-0">Discount (20%):</p>
                      <p className="mb-0">-{((calculateSubtotal() * 0.2)).toFixed(2)} LE</p>
                    </div>
                  )}
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-0">Total:</h5>
                    <h5 className="mb-0">{calculateTotal()} LE</h5>
                  </div>
                </div>
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="card">
                <div className="card-body">
                  <button
                    type="button"
                    className="btn aclr btn-lg w-100"
                    onClick={handleOrderNow}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}