import { useSelector } from "react-redux";
import { db, doc } from '../../firebase/firebase';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import Card from '../../Components/Card/card';
import "./Wishlist.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Wishlist() {
  const [realData, setRealData] = useState([]);
  const wishlistRedux = useSelector((state) => state.wishlist.wishlist);
  const CurrentUser = useSelector((state) => state.UserData['UserState']);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (CurrentUser && CurrentUser.uid && CurrentUser !== 'who know') {
      const unsub = onSnapshot(
        doc(db, "users2", CurrentUser.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            const wishlistItems = docSnap.data().allDishes || [];
            setRealData(wishlistItems);
          } else {
            setRealData([]);
          }
        },
        (error) => console.error("Firestore listener error:", error)
      );
      return () => unsub();
    } else {
      setRealData(wishlistRedux || []);
    }
  }, [CurrentUser, wishlistRedux]);

  // Theme classes
  const bgColor = theme === "dark" ? "bg-custom-dark" : "bg-custom-light";
  const textColor = theme === "dark" ? "text-white" : "text-dark";

  // Toast notification handlers
  const handleAddToCartToast = (title) => {
    toast.success(
      `${title} ${text?.addedToCartToast || (currentLange === "Ar" ? "أضيف إلى العربة!" : "Added to cart!")}`,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const handleRemoveFromCartToast = (title) => {
    toast.info(
      `${title} ${text?.removedFromCartToast || (currentLange === "Ar" ? "تمت إزالته من العربة!" : "Removed from cart!")}`,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const handleAddToWishlistToast = (title) => {
    toast.success(
      `${title} ${text?.addedToWishlistToast || (currentLange === "Ar" ? "أضيف إلى قائمة الرغبات!" : "Added to wishlist!")}`,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const handleRemoveFromWishlistToast = (title) => {
    toast.info(
      `${title} ${text?.removedFromWishlistToast || (currentLange === "Ar" ? "تمت إزالته من قائمة الرغبات" : "Removed from wishlist!")}`,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  return (
    <div className={`wishlist-page py-5 ${bgColor} ${textColor}`} style={{ minHeight: '100vh' }}>
      <div className="container pt-5">
        <h1 className={`text-center mb-5 ${textColor}`}>
          {currentLange === "Ar" ? "قائمة رغباتك" : "Your Wishlist"}
        </h1>
        {realData.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
            {realData.map((dish, index) => {
              // Use translation file as fallback for title_ar and desc_ar
              const fallbackTitleAr = text?.menuItems?.[dish.id]?.title || dish.title_ar || "عنوان غير متوفر";
              const fallbackDescAr = text?.menuItems?.[dish.id]?.description || dish.desc_ar || "الوصف غير متوفر";
              const displayTitle = currentLange === "Ar" ? (dish.title_ar || fallbackTitleAr) : (dish.title || "Title not available");
              
              return (
                <div className="col" key={index}>
                  <Card
                    title={dish.title || "Title not available"}
                    title_ar={dish.title_ar || fallbackTitleAr}
                    poster_path={dish.poster_path || "default-image.jpg"}
                    price={dish.price || "Price not available"}
                    currency={currentLange === "Ar" ? "جنيه" : "LE"}
                    description={dish.description || "Description not available"}
                    desc_ar={dish.desc_ar || fallbackDescAr}
                    onAddToCart={() => handleAddToCartToast(displayTitle)}
                    onRemoveFromCart={() => handleRemoveFromCartToast(displayTitle)}
                    onAddToWishlist={() => handleAddToWishlistToast(displayTitle)}
                    onRemoveFromWishlist={() => handleRemoveFromWishlistToast(displayTitle)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className={`text-center fs-4 mt-5 ${textColor}`}>
            {currentLange === "Ar" ? "قائمة رغباتك فارغة" : "Your wishlist is empty."}
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Wishlist;