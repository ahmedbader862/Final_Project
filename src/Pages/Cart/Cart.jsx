import React, { useState, useEffect } from 'react';
import './Cart.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { db, doc, setDoc, onSnapshot } from '../../firebase/firebase';

export default function Cart() {
  const userState55 = useSelector((state) => state.UserData['UserState']);
  const [cartItems, setCartItems] = useState([]);

  // Fetch and listen to cart items in real-time
  useEffect(() => {
    if (userState55 && userState55.uid) {
      const docRef = doc(db, "users2", userState55.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Real-time cart data:", data.cartItems); // Debug log
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

  // Handle quantity decrease
  const handleStepDown = async (item) => {
    try {
      const docRef = doc(db, "users2", userState55.uid);
      const currentCart = cartItems;
      const updatedCart = currentCart.map(cartItem => {
        if (cartItem.title === item.title && cartItem.quantity > 1) {
          return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
        return cartItem;
      });
      await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
      console.log("Quantity decreased for:", item.title);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  // Handle quantity increase
  const handleStepUp = async (item) => {
    try {
      const docRef = doc(db, "users2", userState55.uid);
      const currentCart = cartItems;
      const updatedCart = currentCart.map(cartItem => {
        if (cartItem.title === item.title) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });
      await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
      console.log("Quantity increased for:", item.title);
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      const docRef = doc(db, "users2", userState55.uid);
      const currentCart = [...cartItems];
      console.log("Current cart before removal:", currentCart);
      const updatedCart = currentCart.filter(cartItem => cartItem.title !== item.title);

      await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
      console.log("Item removed successfully:", item.title);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Calculate the total price for an item (price × quantity)
  const calculateTotalPrice = (item) => {
    const total = item.price * item.quantity;
    return total.toFixed(2); // Format to 2 decimal places
  };

  return (
    <section className="h-100 mt-5">
      <div className="container h-100 py-5">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-normal mb-0">Restaurant Cart</h3>
              <div>
                <p className="mb-0">
                  <span className="text-muted">Sort by:</span>{' '}
                  <a href="#!" className="text-body">
                    price <i className="bi bi-chevron-down mt-1"></i>
                  </a>
                </p>
              </div>
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
                          name="quantity"
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
                        <button className="text-danger" onClick={() => handleRemoveItem(item)}>
                          <i className="bi bi-trash3 icon-visible"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Your cart is empty.</p>
            )}

            <div className="card mb-4">
              <div className="card-body p-4 d-flex flex-row">
                <div className="form-outline flex-fill">
                  <input type="text" id="discountCode" className="form-control form-control-lg" />
                  <label className="form-label badge bdg px-2 text-white mt-1" htmlFor="discountCode">
                    Coupon Code
                  </label>
                </div>
                <button type="button" className="btn aclr btn-lg ms-3">
                  Apply
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <Link to="/shippingadress" type="button" className="btn clr btn-lg w-100">
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}