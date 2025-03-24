import { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../../firebase/firebase';
import { useParams } from 'react-router-dom';
import Card from '../../Components/Card/card';
import '../Dishes/dishes.css';

function Dishes() {
  const { id } = useParams(); 
  const [dishes, setDishes] = useState([]);
  const [image, setImage] = useState('image');
  const [title, setTitle] = useState('title');

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
  }, [id]);

  console.log(dishes);

  return (
    <div className="container my-5"> {/* Added container and margin */}
      <div className="row g-4 mt-5"> {/* Responsive grid with gutter spacing */}
        {dishes.map(dish => (
          <div className="col-12 col-md-6 col-lg-4" key={dish.id}> {/* Responsive columns */}
            <Card
              title={
                Array.isArray(dish[title]) 
                  ? dish[title] // For sandwiches
                  : dish[title]
              }
              poster_path={
                Array.isArray(dish[image]) 
                  ? dish[image][1]['lg'] // For sandwiches
                  : dish[image]
              }
              price={dish.price}
              description={dish.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dishes;
