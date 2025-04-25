import { useSelector } from "react-redux";
import Card from '../../Components/Card/card';
import { db, doc } from '../../firebase/firebase';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react";

function Wishlist() {
  const [realData, setRealData] = useState([]);

  const wishlistRedux = useSelector((state) => state.wishlist.wishlist);
  const CurrentUser = useSelector((state) => state.UserData['UserState']);
  const currentLange = useSelector((state) => state.lange.langue); // جلب اللغة الحالية

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
      // إذا لم يكن المستخدم مسجلًا، استخدم بيانات Redux
      setRealData(wishlistRedux);
    }
  }, [CurrentUser, wishlistRedux]);

  return (
    <div>
      <div id="aa">
        {realData.map((dish, idx) => {
          const title = currentLange === "Ar" 
            ? dish.title_ar || dish.title || "عنوان غير متوفر" 
            : dish.title || "Title not available";
          
          const description = currentLange === "Ar" 
            ? dish.description_ar || dish.description || "الوصف غير متوفر" 
            : dish.description || "Description not available";
          
          const price = dish.price ? `${dish.price} LE` : "السعر غير متوفر";

          return (
            <Card
              key={idx}
              title={title}
              poster_path={dish.poster_path || "default-image.jpg"}
              price={price}
              description={description}
            />
          );
        })}
      </div>
      <div className="flex justify-center mt-10"></div>
    </div>
  );
}

export default Wishlist;