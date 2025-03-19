  import { useDispatch, useSelector,  } from "react-redux";
  import { Link } from "react-router-dom";
  import '../Card/card.css';
  import { removWishlist, setWishlist } from "../../redux/reduxtoolkit";
  import { db,  getDoc, doc, setDoc } from '../../firebase/firebase';

  function Carde(props) {
    const dispatch = useDispatch();

    const wishlistRedux = useSelector((state) => state.wishlist.wishlist);

    const userState55 = useSelector((state) => state.UserData['UserState']);

  // ((((((((((((((((((((((((((((((((  wishlistRedux  ))))))))))))))))))))))))))))))))
    const findDishesInWishlist = wishlistRedux.some((dish) => dish.title === props.title);

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
  // ((((((((((((((((((((((((((((((((  wishlistRedux  ))))))))))))))))))))))))))))))))


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




    return (
      <div className="card-container">
        {/* Favorite Icon */}
        <button className={`fav-icon ${findDishesInWishlist ? 'active' : ''}`} onClick={
          userState55 === "who know" ? handleToggleWishlist : toggleFirestore
        }>
          <i className="fas fa-heart"></i>
        </button>

        {/* Food Image */}
        <div className="image-wrapper">
          <img src={props.poster_path} className="card-image" alt={props.title} />
        </div>

        {/* Food Details */}
        <div className="all-details">
        <div className="card-details mb-5">
        <h5 className="food-title">
    {props.title.split(" ").length > 2
      ? props.title.split(" ").slice(0, 2).join(" ") + " ..."
      : props.title}
  </h5>
          <p className="food-description ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias culpa architecto maxime.</p>
        </div>
        
        {/* Price and Add Button at the Bottom */}
        <div className="price-container mt-5">
          <span className="food-price">$120</span>
          <button className="add-btn">
            <i className="fas fa-plus"></i>
          </button>
        </div>
        </div>
      </div>
    );
  }

  export default Carde;
