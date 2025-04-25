import { useSelector } from "react-redux";
import { db, doc, getDoc } from '../../firebase/firebase';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import Card from '../../Components/Card/card';
import "./Wishlist.css";

function Wishlist() {
  const [realData, setRealData] = useState([]);
  const wishlistRedux = useSelector((state) => state.wishlist.wishlist);
  const CurrentUser = useSelector((state) => state.UserData['UserState']);
  const currentLange = useSelector((state) => state.lange.langue);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (CurrentUser && CurrentUser.uid && CurrentUser !== 'who know') {
      const unsub = onSnapshot(
        doc(db, "users2", CurrentUser.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            setRealData(docSnap.data().allDishes || []);
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

  return (
    <div className={`wishlist-page py-5 ${bgColor} ${textColor}`} style={{ minHeight: '100vh' }}>
      <div className="container pt-5">
        <h1 className={`text-center mb-4 ${textColor}`}>
          {currentLange === "Ar" ? "قائمة رغباتك" : "Your Wishlist"}
        </h1>
        {realData.length > 0 ? (
          <div className="row g-2 justify-content-center">
            {realData.map((dish, index) => {
              const title = currentLange === "Ar"
                ? dish.title_ar || dish.title || "عنوان غير متوفر"
                : dish.title || "Title not available";
              const description = currentLange === "Ar"
                ? dish.description_ar || dish.description || "الوصف غير متوفر"
                : dish.description || "Description not available";
              const price = dish.price
                ? `${dish.price} ${currentLange === "Ar" ? "جنيه" : "LE"}`
                : currentLange === "Ar" ? "السعر غير متوفر" : "Price not available";

              return (
                <div className="col-12 col-md-6 col-lg-3" key={index}>
                  <Card
                    title={title}
                    poster_path={dish.poster_path || "default-image.jpg"}
                    price={price}
                    description={description}
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
    </div>
  );
}

export default Wishlist;