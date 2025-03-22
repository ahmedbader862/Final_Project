import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import '../Card/card.css';
import { removWishlist, setWishlist } from "../../redux/reduxtoolkit";
import { db, getDoc, doc, setDoc } from '../../firebase/firebase';

function Carde(props) {
  const dispatch = useDispatch();

  const wishlistRedux = useSelector((state) => state.wishlist.wishlist);
  const userState55 = useSelector((state) => state.UserData['UserState']);
  const findDishesInWishlist = wishlistRedux.some((dish) => dish.title === props.title);

  // ((((((((((((((((((((((((((((((((  wishlistRedux  )))))))))))))))))))))))))))))))

  const handleAddWishlist = () => {
    console.log("ssssssssssssssssssprops");
    console.log(props);

    dispatch(
      setWishlist({
        title: props.title,
        poster_path: props.poster_path,
      })
    );
  };

  const handleRemoveWishlist = () => {
    dispatch(removWishlist(props.title));
    console.log("rRRRRRRRRRRRRRRRRRRRRRRRRR");
  };

  const handleToggleWishlist = () => {
    if (findDishesInWishlist) {
      handleRemoveWishlist();
    } else {
      handleAddWishlist();
    }
  };

  // ((((((((((((((((((((((((((((((((  wishlistRedux  )))))))))))))))))))))))))))))))

  // ((((((((((((((((((((((((((((((((  wishlistFirestore  ))))))))))))))))))))))))))))))))

  const toggleFirestore = async () => {
    try {
      const docRef = doc(db, "users2", userState55.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // بنجيب الداتا الموجودة في allDishes، لو مفيش بنعمل مصفوفة فاضية
        const currentDishes = docSnap.data().allDishes || [];
        // بنشوف هل الطبق موجود أصلاً بناءً على العنوان
        const dishExists = currentDishes.some(dish => dish.title === props.title);

        if (dishExists) {
          // لو الطبق موجود، هنفلتره من المصفوفة (يعني هنعمل عملية حذف)
          const updatedDishes = currentDishes.filter(dish => dish.title !== props.title);
          await setDoc(docRef, { allDishes: updatedDishes }, { merge: true });
          console.log("تم حذف الطبق من Firestore!");
        } else {
          // لو الطبق مش موجود، هنضيفه للمصفوفة
          const updatedDishes = [
            ...currentDishes,
            { title: props.title, poster_path: props.poster_path }
          ];
          await setDoc(docRef, { allDishes: updatedDishes }, { merge: true });
          console.log("تمت إضافة الطبق إلى Firestore!");
        }
      } else {
        // لو المستند مش موجود، هنعمله إنشاء وهنضيف الطبق
        await setDoc(docRef, { allDishes: [{ title: props.title, poster_path: props.poster_path }] });
        console.log("المستند مش موجود، تم إنشاءه وإضافة الطبق!");
      }
    } catch (error) {
      console.error("خطأ أثناء تحديث Firestore:", error);
    }
  };

  // ((((((((((((((((((((((((((((((((  wishlistFirestore  ))))))))))))))))))))))))))))))))

  // Add to Cart Function
  const addToCartFirestore = async () => {
    if (!userState55 || !userState55.uid) {
      console.log("User not logged in");
      return;
    }

    try {
      const docRef = doc(db, "users2", userState55.uid);
      const docSnap = await getDoc(docRef);

      // Ensure the price is a number (if it's "Price not available", set it to 0 or handle it differently)
      const itemPrice = props.price === "Price not available" ? 0 : parseFloat(props.price);

      if (docSnap.exists()) {
        const currentCart = docSnap.data().cartItems || [];

        // Check if the item already exists in the cart
        const itemIndex = currentCart.findIndex(item => item.title === props.title);

        let updatedCart;
        if (itemIndex >= 0) {
          // Item already in cart, update quantity
          updatedCart = currentCart.map((item, index) =>
            index === itemIndex ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          // Item not in cart, add new item
          updatedCart = [
            ...currentCart,
            {
              title: props.title,
              poster_path: props.poster_path,
              price: itemPrice, // Use the dynamic price from props
              quantity: 1,
              description: props.description // Include description
            }
          ];
        }

        await setDoc(docRef, { cartItems: updatedCart }, { merge: true });
        console.log("Item successfully added to cart in Firestore!");
      } else {
        await setDoc(docRef, {
          cartItems: [{
            title: props.title,
            poster_path: props.poster_path,
            price: itemPrice, // Use the dynamic price from props
            quantity: 1,
            description: props.description // Include description
          }]
        });
        console.log("Document created and item successfully added to cart!");
      }
    } catch (error) {
      console.error("Error adding to cart in Firestore:", error);
    }
  };

  return (
    <div className="card-container">
      <button
        className={`fav-icon ${findDishesInWishlist ? 'active' : ''}`}
        onClick={userState55 === "who know" ? handleToggleWishlist : toggleFirestore}
      >
        <i className="fas fa-heart"></i>
      </button>

      <div className="image-wrapper">
        <img src={props.poster_path} className="card-image" alt={props.title} />
      </div>

      <div className="all-details">
        <div className="card-details mb-5">
          <h5 className="food-title">
            {props.title.split(" ").length > 2
              ? props.title.split(" ").slice(0, 2).join(" ") + " ..."
              : props.title}
          </h5>
          <p className="food-description">
            {props.description.split(" ").length > 10
              ? props.description.split(" ").slice(0, 10).join(" ") + " ..."
              : props.description}
          </p>
        </div>

        <div className="price-container mt-5">
          <span className="food-price">{props.price || 'Price not available'} LE</span>
          <button
            className="add-btn"
            onClick={addToCartFirestore}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carde;
