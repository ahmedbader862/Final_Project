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
    <div className="card" style={{ width: "18rem", margin: "10px" }}>
      <button onClick={
              userState55 == "who know" ?
        handleToggleWishlist : 
        toggleFirestore
        


      }> <i className="fas fa-heart"></i>  </button>
      <img
        src={props.poster_path}
        className="card-img-top"
        alt={props.title}
        style={{ height: "230px", objectFit: "" }}
      />
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>

<div className="d-flex justify-content-between">
<Link to={props.path} className="btn btn-primary ">
          Go to movie
        </Link>

        <button className="btn bg-danger "  >
          add
        </button>
</div>

      </div>
    </div>
  );
}

export default Carde;
