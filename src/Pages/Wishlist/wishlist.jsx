import { useSelector } from "react-redux";
import Card from '../../Components/Card/card';
import { db,  getDoc, doc, } from '../../firebase/firebase';
import {  useEffect, useState } from "react";
function Wishlist() {



  const [realData , setRealData] = useState([]);

  const wishlistRedux = useSelector((state) => state.wishlist.wishlist);

  const  CurrentUser = useSelector((state) => state.UserData['UserState']);
  // console.log(CurrentUser.uid);
  // console.log(wishlistRedux);
  console.log("CurrentUser UID:", CurrentUser.uid);

useEffect(() => {

  if (CurrentUser != 'who know') {

    const getDishes = async () => {
      try {
    
     const docRef = doc(db, "users2", CurrentUser.uid );
     const docSnap = await getDoc(docRef);
     if (docSnap.exists()) {
    console.log("Document data:", docSnap.data()['allDishes']);
    setRealData(docSnap.data()['allDishes']);
  } else {
    console.log("No such document!");
  }
      } catch (error) {
        console.error("???????????????????????", error);
      }
    };
  
    getDishes();
  }else{
    setRealData(wishlistRedux);
  }

  
  
}, [CurrentUser, wishlistRedux]);


// ####################################################
    return (
        
         <div className="">


            <div id="aa" >
       
            {realData.map((dish) => (
  <Card
    
    title={dish.title}
    poster_path={dish.poster_path}
  />
))}

      </div>
        <div className="flex justify-center mt-10">
      </div>

        
       </div>
    );
}
export default Wishlist;