import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removWishlist, setWishlist } from "../../redux/reduxtoolkit";
import { db, getDoc, doc, setDoc } from '../../firebase/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from "../../Context/ThemeContext";
import Modal from 'react-bootstrap/Modal';
import '../Card/card.css';

function Carde({ title, poster_path, description, price }) {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);

  const wishlist = useSelector((state) => state.wishlist?.wishlist || []);
  const user = useSelector((state) => state.UserData?.UserState || null);
  const isInWishlist = wishlist.some((dish) => dish.title === title);

  const safeTitle = title || "Unnamed Item";
  const safeDescription = description || "No description";
  const safePosterPath = poster_path || "default-image.jpg";
  const safePrice = price || "Price not available";

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removWishlist(safeTitle));
      toast.info(`${safeTitle} removed from wishlist`, { position: "top-right", autoClose: 2000 });
    } else {
      dispatch(setWishlist({ title: safeTitle, poster_path: safePosterPath }));
      toast.success(`${safeTitle} added to wishlist`, { position: "top-right", autoClose: 2000 });
    }
  };

  const toggleFirestore = async () => {
    if (!user?.uid) return toast.error("User not authenticated", { position: "top-right", autoClose: 2000 });

    try {
      const docRef = doc(db, "users2", user.uid);
      const docSnap = await getDoc(docRef);
      const dishes = docSnap.exists() ? docSnap.data().allDishes || [] : [];
      const dishExists = dishes.some((dish) => dish.title === safeTitle);

      const updatedDishes = dishExists
        ? dishes.filter((dish) => dish.title !== safeTitle)
        : [...dishes, { title: safeTitle, poster_path: safePosterPath }];

      await setDoc(docRef, { allDishes: updatedDishes }, { merge: true });
      toast[dishExists ? "info" : "success"](`${safeTitle} ${dishExists ? "removed from" : "added to"} wishlist!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Firestore error:", error);
      toast.error("Error updating wishlist", { position: "top-right", autoClose: 2000 });
    }
  };

  const addToCartFirestore = async () => {
    if (!user?.uid) return toast.error("Please login to add items to cart", { position: "top-right", autoClose: 2000 });

    try {
      const docRef = doc(db, "users2", user.uid);
      const docSnap = await getDoc(docRef);
      const itemPrice = safePrice === "Price not available" ? 0 : parseFloat(safePrice);
      const cart = docSnap.exists() ? docSnap.data().cartItems || [] : [];

      const itemIndex = cart.findIndex((item) => item.title === safeTitle);
      const updatedCart = itemIndex >= 0
        ? cart.map((item, i) => (i === itemIndex ? { ...item, quantity: item.quantity + 1 } : item))
        : [...cart, { title: safeTitle, poster_path: safePosterPath, price: itemPrice, quantity: 1, description: safeDescription }];

      await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
      toast.success(`${safeTitle} added to cart!`, { position: "top-right", autoClose: 2000 });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding to cart", { position: "top-right", autoClose: 2000 });
    }
  };

  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const bgColor = theme === "dark" ? "bg-dark" : "bg-light";
  const iconColor = theme === "dark" ? "text-white" : "text-dark";

  return (
    <>
      <div
        className={`card card-container ${bgColor}`}
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer" }}
      >
        <button
          className={`fav-icon ${isInWishlist ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            user === "who know" ? handleToggleWishlist() : toggleFirestore();
          }}
        >
          <i
  className="fas fa-heart"
  style={{
    color: isInWishlist ? "red" : theme === "dark" ? "#ffffffcc" : "#6c757d", // white-ish or gray
    transition: "color 0.3s ease"
  }}
></i>

        </button>
        <div className="image-wrapper">
          <img src={safePosterPath} className="card-image" alt={safeTitle} />
        </div>
        <div className={`all-details ${textColor}`}>
          <div className="card-details mb-5">
            <h5 className={`food-title ${textColor}`}>
              {safeTitle.split(" ").length > 2 ? safeTitle.split(" ").slice(0, 2).join(" ") + " ..." : safeTitle}
            </h5>
            <p className={`food-description ${textColor}`}>
              {safeDescription.split(" ").length > 8 ? safeDescription.split(" ").slice(0, 8).join(" ") + " ..." : safeDescription}
            </p>
          </div>
          <div className="price-container mt-5 d-flex justify-content-between align-items-center">
            <span className={`food-price ${textColor}`}>{safePrice} LE</span>
            <button
              className={`add-btn ${theme === "dark" ? "add-btn-dark" : "add-btn"}`}
              onClick={(e) => {
                e.stopPropagation();
                addToCartFirestore();
              }}
            >
              <i className={`fas fa-plus ${iconColor}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="custom-modal"
      >
        
        <Modal.Body closeButton className={`${bgColor} ${textColor}`}>
          <h2>{safeTitle}</h2>
          <div className="text-center mb-3">
            <img src={safePosterPath} alt={safeTitle} className="img-fluid rounded" style={{ maxHeight: "250px", objectFit: "cover" }} />
          </div>
          <p>{safeDescription}</p>
          <p><strong>Price:</strong> {safePrice} LE</p>
          <button
            className={`btn ${theme === "dark" ? "btn-outline-light" : "btn-outline-dark"} me-2`}
            onClick={addToCartFirestore}
          >
            Add to Cart
          </button>
          <button
            className={`btn ${theme === "dark" ? "btn-outline-light" : "btn-outline-dark"}`}
            onClick={() => (user === "who know" ? handleToggleWishlist() : toggleFirestore())}
          >
            {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </Modal.Body>
        
      </Modal>
    </>
  );
}

export default Carde;
