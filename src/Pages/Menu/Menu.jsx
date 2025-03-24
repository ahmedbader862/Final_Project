import { useState, useEffect } from "react";
import { db, getDocs, collection } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import './Menu.css';
import { FreeMode } from "swiper/modules";
import Card from "../../Components/Card/card";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Menu() {
  const navigate = useNavigate();

  const [softDrinks, setSoftDrinks] = useState([]);
  const [chickenSandwiches, setChickenSandwiches] = useState([]);
  const [beefSandwiches, setBeefSandwiches] = useState([]);
  const [hotDrinks, setHotDrinks] = useState([]);
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    const getCategoryData = async (category, setCategory) => {
      const itemsCollectionRef = collection(db, "menu", category, "items");
      const querySnapshot = await getDocs(itemsCollectionRef);

      const categoryData = querySnapshot.docs.map((doc) => {
        const itemData = doc.data();
        return {
          id: doc.id,
          title: itemData.title || "Unnamed Item",
          description: itemData.description || "No description available",
          image: itemData.image || "default-image.jpg",
          price: itemData.price || "Price not available",
        };
      });

      setCategory(categoryData);
    };

    getCategoryData("chicken sandwich", setChickenSandwiches);
    getCategoryData("beef sandwich", setBeefSandwiches);
    getCategoryData("pizaa", setPizzas);
    getCategoryData("soft drinks", setSoftDrinks);
    getCategoryData("hot drinks", setHotDrinks);
  }, []);

  const handleAddToCart = (item) => {
    toast.success(`${item.title} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleAddToWishlist = (item) => {
    toast.info(`${item.title} added to wishlist!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleNavigate = (category) => {
    navigate(`/Dishes/${category}`);
  };

  const renderCategorySection = (title, items, categoryKey) => (
    <div className="category-section mt-5">
      <div className="category-header align-items-center d-flex justify-content-between">
        <h2>{title}</h2>
        <a
          onClick={() => handleNavigate(categoryKey)}
          className="see-all-btn text-decoration-none"
        >
          See All <span><i className="fa-solid fa-greater-than"></i></span>
        </a>
      </div>

      {items.length > 0 ? (
        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          loop={true}
          speed={600}
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            480: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="category-slider"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <Card
                poster_path={item.image}
                title={item.title}
                price={item.price}
                description={item.description}
                onAddToCart={() => handleAddToCart(item)}
                onAddToWishlist={() => handleAddToWishlist(item)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>No {title} Available</p>
      )}
    </div>
  );

  return (
    <div className="menu-container container mx-auto text-white mt-5">
      <h1 className="text-center menu-title">
        Our <span className="text-danger">Menu</span>
      </h1>
      {renderCategorySection("Chicken Sandwiches", chickenSandwiches, "chicken sandwich")}
      {renderCategorySection("Beef Sandwiches", beefSandwiches, "beef sandwich")}
      {renderCategorySection("Pizzas", pizzas, "pizaa")}
      {renderCategorySection("Soft Drinks", softDrinks, "soft drinks")}
      {renderCategorySection("Hot Drinks", hotDrinks, "hot drinks")}

      <ToastContainer />
    </div>
  );
}

export default Menu;