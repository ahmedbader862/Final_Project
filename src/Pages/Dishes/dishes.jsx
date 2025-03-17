import { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../../firebase/firebase';
import { useParams } from 'react-router-dom';
import Card from '../../Components/Card/card';
import '../Dishes/dishes.css'
function Dishes() {
  const { id } = useParams(); 
  const [dishes, setDishes] = useState([]);
  const [image , setImage]  = useState('image')
  const [title , setTiltle]  = useState('title')

   


  useEffect(() => {

    if (id == 'sandwiches') {
    setImage('images')
    setTiltle('name')

   }
   else if (id == 'pizaa' || id == 'desserts'){
    setImage('img')
    setTiltle('name')
   }

    const getDishes = async () => {
      try {
        const dishesCollectionRef = collection(db, "menu", id, "items");
        const querySnapshot = await getDocs(dishesCollectionRef);

        const dishesData = [];
        querySnapshot.forEach((doc) => {
          dishesData.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setDishes(dishesData);
      } catch (error) {
        console.error("???????????????????????", error);
      }
    };

    
      getDishes();
    
  }, [id]);

  console.log(dishes);
  

  return (
    
    <div id='aa'>
        {dishes.map(dish => (
          <>
          <Card
         title={
          Array.isArray(dish[title]) 
          ? dish[title]// للسندويشات
          : dish[title] 

        }


         poster_path={
          Array.isArray(dish[image]) 
                      ? dish[image][1]['lg']// للسندويشات
                      : dish[image] 

         }
         />
          </>
        ))}
      
      
      
    </div>
  );
}

export default Dishes;
