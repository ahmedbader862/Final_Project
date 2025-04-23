import { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../../firebase/firebase';
import { useParams } from 'react-router-dom';
import Card from '../../Components/Card/card';
import '../Dishes/dishes.css';
import { useSelector } from "react-redux";

function Dishes() {
  const { id } = useParams(); 
  const [dishes, setDishes] = useState([]);
  const [image, setImage] = useState('image');
  const [title, setTitle] = useState('title');

const currentLange = useSelector((state) => state.lange.langue);
const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  useEffect(() => {
    // Set image and title keys based on category
    if (id === 'sandwiches') {
      setImage('images');
      setTitle('name');
    } else if (id === 'pizaa' || id === 'desserts') {
      setImage('image');
      setTitle('title');
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
  }, [id , currentLange]);

  console.log(dishes);

  return (
    <div className="container my-5"> {/* Added container and margin */}
      <div className="row g-4 mt-5"> {/* Responsive grid with gutter spacing */}
        {dishes.map(dish => (
          <div className="col-12 col-md-6 col-lg-4" key={dish.id}> {/* Responsive columns */}
            <Card
            title={
              currentLange === "Ar" 
                ? dish.title_ar || "عنوان غير متوفر" 
                : dish.title || "Title not available"
            }
              poster_path={
                Array.isArray(dish[image]) 
                  ? dish[image][1]['lg'] // For sandwiches
                  : dish[image]
              }
              price={dish.price}
              description={currentLange === "En" ? dish.description : dish.desc_ar}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dishes;
