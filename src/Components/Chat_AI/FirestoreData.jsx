import { useEffect, useState } from "react";
import { db, getDocs, collection,  } from "../../firebase/firebase";
import { useDispatch } from "react-redux";
import { setFireData } from "../../redux/reduxtoolkit";

function FirestoreData() {

  const disbatch = useDispatch();


  const [menu, setMenu] = useState([]);
  // const [users, setUsers] = useState([]);
  // const [orders, setOrders] = useState([]);
  // const [reservations, setReservations] = useState([]);
  const [dishesByCategory, setDishesByCategory] = useState({});
  const [allData, setAllData] = useState({});
  
  useEffect(() => {
    setAllData({
      // menu,
      // users,
      // orders,
      // reservations,
      dishesByCategory
    });
 
    
  }, [dishesByCategory]);

  useEffect(() => {
    console.log("Updated All Data:", allData.orders);
    disbatch(setFireData(allData));

  }, [allData,disbatch]);

  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  // Fetch menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menu"));
        const categories = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMenu(categories);
       console.log(categories);
       
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Fetch once on mount

// (((((((((((((((((((((((((((((((((((   )))))))))))))))))))))))))))))))))))

  // Fetch users2


  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "users2"));
  //       const categories = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data()
  //       }));
  //       setUsers(categories);
  //      console.log(categories);
       
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  // (((((((((((((((((((((((((((((((((((   )))))))))))))))))))))))))))))))))))

  // Fetch orders
  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "orders"));
  //       const categories = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data()
  //       }));
  //       setOrders(categories);
  //      console.log(categories);
       
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     }
  //   };

  //   fetchOrders();
  // }, []);



   // (((((((((((((((((((((((((((((((((((   )))))))))))))))))))))))))))))))))))

  // Fetch reservations
  // useEffect(() => {
  //   const fetchReservations= async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "reservations"));
  //       const categories = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data()
  //       }));
  //       setReservations(categories);
  //      console.log(categories);
       
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     }
  //   };

  //   fetchReservations();
  // }, []);




  
  // Fetch Dishes when categories are loaded
  useEffect(() => {
    const fetchAllDishes = async () => {
      try {
        const dishesPromises = menu.map(async (category) => {
          const dishesRef = collection(db, "menu", category.id, "items");
          const snapshot = await getDocs(dishesRef);
          return {
            categoryId: category.id,
            dishes: snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
          };
        });

        const allDishes = await Promise.all(dishesPromises);
        const dishesMap = allDishes.reduce((acc, curr) => {
          acc[curr.categoryId] = curr.dishes;
          return acc;
        }, {});
        console.log(dishesMap);

        setDishesByCategory(dishesMap);
       console.log(dishesMap);

      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    if (menu.length > 0) {
      fetchAllDishes();
    }
  }, [menu]); // Run when userCategories changes

// ##############################################################################################





  return (
 <h1>fffffffffffffffffffffffffff</h1>
  );
  
}
export default FirestoreData;