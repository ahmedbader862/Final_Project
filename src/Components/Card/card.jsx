import React, { useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removWishlist, setWishlist } from "../../redux/reduxtoolkit";
import { db, getDoc, doc, setDoc, onSnapshot } from "../../firebase/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../Context/ThemeContext";
import Modal from "react-bootstrap/Modal";
import "../Card/card.css";

function Carde({ title, poster_path, description, price, title_ar, desc_ar }) {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);
  const [isInWishlistFirestore, setIsInWishlistFirestore] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const wishlist = useSelector((state) => state.wishlist?.wishlist || []);
  const user = useSelector((state) => state.UserData?.UserState || null);
  const userState55 = useSelector((state) => state.UserData?.UserState || null);
  const currentLange = useSelector((state) => state.lange?.langue || "en");

  const isInWishlist = wishlist.some((dish) => dish.title === title);

  const safePosterPath = poster_path || "default-image.jpg";
  const safePrice = price || "Price not available";

  // Determine title and description based on language
  const displayTitle = currentLange === "Ar" ? (title_ar || "عنوان غير متوفر") : (title || "Title not available");
  const displayDescription = currentLange === "Ar" ? (desc_ar || "لا يوجد وصف") : (description || "No description");

  // Fetch Firestore wishlist and cart state
  useEffect(() => {
    if (userState55 && userState55.uid && userState55 !== "who know") {
      const unsub = onSnapshot(
        doc(db, "users2", userState55.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            const allDishes = docSnap.data().allDishes || [];
            const exists = allDishes.some((dish) => dish.title === title);
            setIsInWishlistFirestore(exists);

            // Check cart items
            const cartItems = docSnap.data().cartItems || [];
            const inCart = cartItems.some((item) => item.title === title);
            setIsInCart(inCart);
          } else {
            setIsInWishlistFirestore(false);
            setIsInCart(false);
          }
        },
        (error) => console.error("Firestore listener error:", error)
      );
      return () => unsub();
    }
  }, [userState55, title]);

  const handleAddWishlist = () => {
    dispatch(
      setWishlist({
        title: title,
        title_ar: title_ar || "عنوان غير متوفر",
        poster_path: safePosterPath,
        description: description,
        desc_ar: desc_ar || "الوصف غير متوفر",
        price: safePrice,
      })
    );
    toast.success(`${displayTitle} أضيف إلى قائمة الرغبات!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleRemoveWishlist = () => {
    dispatch(removWishlist(title));
    toast.info(`${displayTitle} تمت إزالته من قائمة الرغبات`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const toggleFirestore = async () => {
    if (!user?.uid) {
      if (isInWishlist) {
        handleRemoveWishlist();
        setIsInWishlistFirestore(false);
      } else {
        handleAddWishlist();
        setIsInWishlistFirestore(true);
      }
      return;
    }

    try {
      const docRef = doc(db, "users2", user.uid);
      const docSnap = await getDoc(docRef);
      const dishes = docSnap.exists() ? docSnap.data().allDishes || [] : [];
      const dishExists = dishes.some((dish) => dish.title === title);

      const updatedDishes = dishExists
        ? dishes.filter((dish) => dish.title !== title)
        : [
            ...dishes,
            {
              title: title,
              title_ar: title_ar || "عنوان غير متوفر",
              poster_path: safePosterPath,
              description: description,
              desc_ar: desc_ar || "الوصف غير متوفر",
              price: safePrice,
            },
          ];

      await setDoc(docRef, { allDishes: updatedDishes }, { merge: true });
      setIsInWishlistFirestore(!dishExists);

      toast[dishExists ? "info" : "success"](
        `${displayTitle} ${dishExists ? "تمت إزالته من" : "أضيف إلى"} قائمة الرغبات!`,
        { position: "top-right", autoClose: 2000 }
      );
    } catch (error) {
      console.error("Firestore error:", error);
      toast.error("خطأ في تحديث قائمة الرغبات", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const toggleCartFirestore = async () => {
    if (!user?.uid) {
      return toast.error("يرجى تسجيل الدخول لإضافة عناصر إلى العربة", {
        position: "top-right",
        autoClose: 2000,
      });
    }

    try {
      const docRef = doc(db, "users2", user.uid);
      const docSnap = await getDoc(docRef);
      const cart = docSnap.exists() ? docSnap.data().cartItems || [] : [];
      const itemIndex = cart.findIndex((item) => item.title === title);

      if (itemIndex >= 0) {
        // Item exists in cart, remove it
        const updatedCart = cart.filter((item) => item.title !== title);
        await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
        setIsInCart(false);
        toast.info(`${displayTitle} تمت إزالته من العربة!`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        // Item not in cart, add it
        const itemPrice = safePrice === "Price not available" ? 0 : parseFloat(safePrice);
        const updatedCart = [
          ...cart,
          {
            title: title,
            title_ar: title_ar || "عنوان غير متوفر",
            poster_path: safePosterPath,
            price: itemPrice,
            quantity: 1,
            description: description,
            desc_ar: desc_ar || "الوصف غير متوفر",
          },
        ];
        await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
        setIsInCart(true);
        toast.success(`${displayTitle} أضيف إلى العربة!`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error toggling cart:", error);
      toast.error("خطأ في تحديث العربة", {
        position: "top-right",
        autoClose: 2000,
      });
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
          className={`fav-icon ${user?.uid ? (isInWishlistFirestore ? "active" : "") : (isInWishlist ? "active" : "")}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFirestore();
          }}
        >
          <i
            className="fas fa-heart"
            style={{
              color: user?.uid
                ? isInWishlistFirestore
                  ? "red"
                  : theme === "dark"
                  ? "#ffffffcc"
                  : "#6c757d"
                : isInWishlist
                ? "red"
                : theme === "dark"
                ? "#ffffffcc"
                : "#6c757d",
              transition: "color 0.3s ease",
            }}
          ></i>
        </button>
        <div className="image-wrapper">
          <img src={safePosterPath} className="card-image" alt={displayTitle} />
        </div>
        <div className={`all-details ${textColor}`}>
          <div className="card-details mb-5">
            <h5 className={`food-title ${textColor}`}>
              {displayTitle.split(" ").length > 2
                ? displayTitle.split(" ").slice(0, 2).join(" ") + " ..."
                : displayTitle}
            </h5>
            <p className={`food-description ${textColor}`}>
              {displayDescription.split(" ").length > 8
                ? displayDescription.split(" ").slice(0, 8).join(" ") + " ..."
                : displayDescription}
            </p>
          </div>
          <div className="price-container mt-5 d-flex justify-content-between align-items-center">
            <span className={`food-price ${textColor}`}>
              {safePrice} {currentLange === "Ar" ? "جنيه" : "LE"}
            </span>
            <button
              className={`add-btn ${theme === "dark" ? "add-btn-dark" : "add-btn"} ${isInCart ? "added" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleCartFirestore();
              }}
            >
              <i className={`fas ${isInCart ? "fa-check" : "fa-plus"} ${iconColor}`}></i>
            </button>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Body className={`${bgColor} ${textColor}`}>
          <h2>{displayTitle}</h2>
          <div className="text-center mb-3">
            <img
              src={safePosterPath}
              alt={displayTitle}
              className="img-fluid rounded"
              style={{ maxHeight: "250px", objectFit: "cover" }}
            />
          </div>
          <p>{displayDescription}</p>
          <p>
            <strong>Price:</strong> {safePrice} {currentLange === "Ar" ? "جنيه" : "LE"}
          </p>
          <button
            className={`btn ${theme === "dark" ? "btn-outline-light" : "btn-outline-dark"} me-2`}
            onClick={toggleCartFirestore}
          >
            {isInCart ? "إزالة من العربة" : "إضافة إلى العربة"}
          </button>
          <button
            className={`btn ${theme === "dark" ? "btn-outline-light" : "btn-outline-dark"}`}
            onClick={() => toggleFirestore()}
          >
            {isInWishlist ? "إزالة من قائمة الرغبات" : "إضافة إلى قائمة الرغبات"}
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Carde;