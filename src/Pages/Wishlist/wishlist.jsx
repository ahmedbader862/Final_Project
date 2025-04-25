import { useSelector } from "react-redux";
import Card from '../../Components/Card/card';
import { db, getDoc, doc } from '../../firebase/firebase';
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

function Wishlist() {
  const [realData, setRealData] = useState([]);

  const wishlistRedux = useSelector((state) => state.wishlist.wishlist);
  const CurrentUser = useSelector((state) => state.UserData['UserState']);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (CurrentUser && CurrentUser.uid) {
      const getDishes = async () => {
        try {
          const docRef = doc(db, "users2", CurrentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const allDishes = docSnap.data()['allDishes'];
            console.log("Document data:", allDishes);
            setRealData(allDishes || []);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user wishlist:", error);
        }
      };

      getDishes();
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
        <h1 className={`text-center mb-4 ${textColor}`}>Your Wishlist</h1>
        {realData.length > 0 ? (
          <div className="row g-2 justify-content-center">
            {realData.map((dish, index) => (
              <div className="col-12 col-md-6 col-lg-3" key={index}>
                
                <Card
                  title={dish.title}
                  poster_path={dish.poster_path}
                  price={dish.price}
                  description={dish.description}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center fs-4 mt-5 ${textColor}`}>Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
