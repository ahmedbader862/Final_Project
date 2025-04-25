import React, { useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import '../Card/card.css';
import { removWishlist, setWishlist } from "../../redux/reduxtoolkit";
import { db, getDoc, doc, setDoc, onSnapshot } from '../../firebase/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from "../../Context/ThemeContext";

function Carde(props) {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  const wishlistRedux = useSelector((state) => state.wishlist?.wishlist || []);
  const userState55 = useSelector((state) => state.UserData?.['UserState'] || null);
  const findDishesInWishlist = wishlistRedux.some((dish) => dish.title === props.title);
  const [isInWishlistFirestore, setIsInWishlistFirestore] = useState(false); // حالة جديدة لـ Firestore

  // جلب حالة العنصر من Firestore لما المستخدم مسجل دخول
  useEffect(() => {
    if (userState55 && userState55.uid && userState55 !== "who know") {
      const unsub = onSnapshot(
        doc(db, "users2", userState55.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            const allDishes = docSnap.data().allDishes || [];
            const exists = allDishes.some(dish => dish.title === props.title);
            setIsInWishlistFirestore(exists);
          } else {
            setIsInWishlistFirestore(false);
          }
        },
        (error) => console.error("Firestore listener error:", error)
      );
      return () => unsub();
    }
  }, [userState55, props.title]);

  const handleAddWishlist = () => {
    dispatch(
      setWishlist({
        title: props.title, // العنوان بالإنجليزية
        title_ar: props.title_ar || "عنوان غير متوفر", // العنوان بالعربية
        poster_path: props.poster_path,
        description: props.description, // الوصف بالإنجليزية
        description_ar: props.description_ar || "الوصف غير متوفر", // الوصف بالعربية
        price: props.price,
      })
    );
    toast.success(`${props.title} added to wishlist!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleRemoveWishlist = () => {
    dispatch(removWishlist(props.title));
    toast.info(`${props.title} removed from wishlist`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const toggleFirestore = async () => {
    if (!userState55?.uid) {
      toast.error("User not authenticated", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const docRef = doc(db, "users2", userState55.uid);
      const docSnap = await getDoc(docRef);

      const currentDishes = docSnap.exists() ? docSnap.data().allDishes || [] : [];
      const dishExists = currentDishes.some(dish => dish.title === props.title);

      const updatedDishes = dishExists
        ? currentDishes.filter(dish => dish.title !== props.title)
        : [
            ...currentDishes,
            {
              title: props.title, // العنوان بالإنجليزية
              title_ar: props.title_ar || "عنوان غير متوفر", // العنوان بالعربية
              poster_path: props.poster_path,
              description: props.description, // الوصف بالإنجليزية
              description_ar: props.description_ar || "الوصف غير متوفر", // الوصف بالعربية
              price: props.price,
            },
          ];

      // تحديث Firestore فقط
      await setDoc(docRef, { allDishes: updatedDishes }, { merge: true });

      toast[dishExists ? "info" : "success"](
        `${props.title} ${dishExists ? "removed from" : "added to"} wishlist!`,
        { position: "top-right", autoClose: 2000 }
      );
    } catch (error) {
      console.error("Firestore error:", error);
      toast.error("Error updating wishlist", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleToggleWishlist = () => {
    if (userState55 && userState55.uid) {
      // المستخدم مسجل الدخول: يتعامل مع Firestore فقط
      toggleFirestore();
    } else {
      // المستخدم مش مسجل الدخول: يتعامل مع Redux فقط
      if (findDishesInWishlist) {
        handleRemoveWishlist();
      } else {
        handleAddWishlist();
      }
    }
  };

  const addToCartFirestore = async () => {
    if (!userState55 || !userState55.uid) {
      toast.error("Please login to add items to cart", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const docRef = doc(db, "users2", userState55.uid);
      const docSnap = await getDoc(docRef);

      const itemPrice = props.price === "Price not available" ? 0 : parseFloat(props.price);
      const currentCart = docSnap.exists() ? docSnap.data().cartItems || [] : [];

      const itemIndex = currentCart.findIndex(item => item.title === props.title);

      const updatedCart = itemIndex >= 0
        ? currentCart.map((item, index) =>
            index === itemIndex ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...currentCart, {
            title: props.title,
            poster_path: props.poster_path,
            price: itemPrice,
            quantity: 1,
            description: props.description
          }];

      await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
      toast.success(`${props.title} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding to cart", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const safeTitle = props.title || "Unnamed Item";
  const safeDescription = props.description || "No description";
  const safePosterPath = props.poster_path || "default-image.jpg";
  const safePrice = props.price || "Price not available";

  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const iconColor = theme === "dark" ? "text-white" : "text-dark";

  return (
    <div className={`card card-container ${theme === "dark" ? "bg-dark" : "bg-light"}`}>
      <button
        className={`fav-icon ${(userState55 && userState55.uid) ? (isInWishlistFirestore ? 'active' : '') : (findDishesInWishlist ? 'active' : '')}`}
        onClick={handleToggleWishlist} // الكود الأصلي محافظ عليه
      >
        <i className="fas fa-heart"></i>
      </button>

      <div className="image-wrapper">
        <img src={safePosterPath} className="card-image" alt={safeTitle} />
      </div>

      <div className={`all-details ${textColor}`}>
        <div className="card-details mb-5">
          <h5 className={`food-title ${textColor}`}>
            {safeTitle.split(" ").length > 2
              ? safeTitle.split(" ").slice(0, 2).join(" ") + " ..."
              : safeTitle}
          </h5>
          <p className={`food-description ${textColor}`}>
            {safeDescription.split(" ").length > 8
              ? safeDescription.split(" ").slice(0, 8).join(" ") + " ..."
              : safeDescription}
          </p>
        </div>

        <div className="price-container mt-5 d-flex justify-content-between align-items-center">
          <span className={`food-price ${textColor}`}>{safePrice} LE</span>
          <button
            className={`add-btn ${theme === "dark" ? "add-btn" : "add-btn-dark"}`}
            onClick={addToCartFirestore}
          >
            <i className={`fas fa-plus ${iconColor}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carde;