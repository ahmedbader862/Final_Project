import { useState, useEffect } from "react";
import { db, getDocs, collection } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import './Menu.css';
import { Navigation, FreeMode } from "swiper/modules";
import Card from "../../Components/Card/card";

function Menu() {
  const navigate = useNavigate();

  // 🟢 State for all categories
  const [softDrinks, setSoftDrinks] = useState([]);
  const [chickenSandwiches, setChickenSandwiches] = useState([]);
  const [beefSandwiches, setBeefSandwiches] = useState([]);
  const [hotDrinks, setHotDrinks] = useState([]);

  useEffect(() => {
    const getCategoryData = async (category, setCategory) => {
      // Reference to the "items" subcollection under "menu > category"
      const itemsCollectionRef = collection(db, "menu", category, "items");
      const querySnapshot = await getDocs(itemsCollectionRef);

      // Log the number of documents and their data for debugging
      console.log(`Documents in ${category} > items:`, querySnapshot.docs.length);
      querySnapshot.docs.forEach((doc) => {
        console.log(`Document ID: ${doc.id}, Data:`, doc.data());
      });

      const categoryData = querySnapshot.docs.map((doc) => {
        const itemData = doc.data();
        return {
          id: doc.id,
          title: itemData.title || "Unnamed Item",
          description: itemData.description || "No description available",
          image: itemData.image || "default-image.jpg", // Adjust based on your image field
          price: itemData.price || "Price not available",
        };
      });

      setCategory(categoryData);
    };

    // Fetch data for all categories
    getCategoryData("soft drinks", setSoftDrinks);
    getCategoryData("chicken sandwich ", setChickenSandwiches);
    getCategoryData("beef sandwich", setBeefSandwiches);
    getCategoryData("hot drinks ", setHotDrinks);
  }, []);

  const handleNavigate = (category) => {
    navigate(`/Dishes/${category}`);
  };

  return (
    <div className="menu-container container mx-auto text-white mt-5">
      <h1 className="text-center menu-title">
        Our <span className="text-danger">Menu</span>
      </h1>

      {/* 🥤 Soft Drinks Section */}
      <div className="category-section mt-5">
        <div className="category-header align-items-center d-flex justify-content-between">
          <h2>Soft Drinks</h2>
          <a
            onClick={() => handleNavigate("soft drinks")}
            className="see-all-btn text-decoration-none"
          >
            See All <span><i className="fa-solid fa-greater-than"></i></span>
          </a>
        </div>

        {softDrinks.length > 0 ? (
          <Swiper
            modules={[Navigation, FreeMode]}
            navigation
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
            {softDrinks.map((drink) => (
              <SwiperSlide key={drink.id}>
                <Card
                  poster_path={drink.image}
                  title={drink.title}
                  price={drink.price}
                  description={drink.description}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No Soft Drinks Available</p>
        )}
      </div>

      {/* 🍔 Chicken Sandwich Section */}
      <div className="category-section mt-5">
        <div className="category-header align-items-center d-flex justify-content-between">
          <h2>Chicken Sandwiches</h2>
          <a
            onClick={() => handleNavigate("chicken sandwich")}
            className="see-all-btn text-decoration-none"
          >
            See All <span><i className="fa-solid fa-greater-than"></i></span>
          </a>
        </div>

        {chickenSandwiches.length > 0 ? (
          <Swiper
            modules={[Navigation, FreeMode]}
            navigation
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
            {chickenSandwiches.map((sandwich) => (
              <SwiperSlide key={sandwich.id}>
                <Card
                  poster_path={sandwich.image}
                  title={sandwich.title}
                  price={sandwich.price}
                  description={sandwich.description}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No Chicken Sandwiches Available</p>
        )}
      </div>

      {/* 🍔 Beef Sandwich Section */}
      <div className="category-section mt-5">
        <div className="category-header align-items-center d-flex justify-content-between">
          <h2>Beef Sandwiches</h2>
          <a
            onClick={() => handleNavigate("beef sandwich")}
            className="see-all-btn text-decoration-none"
          >
            See All <span><i className="fa-solid fa-greater-than"></i></span>
          </a>
        </div>

        {beefSandwiches.length > 0 ? (
          <Swiper
            modules={[Navigation, FreeMode]}
            navigation
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
            {beefSandwiches.map((sandwich) => (
              <SwiperSlide key={sandwich.id}>
                <Card
                  poster_path={sandwich.image}
                  title={sandwich.title}
                  price={sandwich.price}
                  description={sandwich.description}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No Beef Sandwiches Available</p>
        )}
      </div>

      {/* ☕ Hot Drinks Section */}
      <div className="category-section mt-5">
        <div className="category-header align-items-center d-flex justify-content-between">
          <h2>Hot Drinks</h2>
          <a
            onClick={() => handleNavigate(" hot drinks")}
            className="see-all-btn text-decoration-none"
          >
            See All <span><i className="fa-solid fa-greater-than"></i></span>
          </a>
        </div>

        {hotDrinks.length > 0 ? (
          <Swiper
            modules={[Navigation, FreeMode]}
            navigation
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
            {hotDrinks.map((drink) => (
              <SwiperSlide key={drink.id}>
                <Card
                  poster_path={drink.image}
                  title={drink.title}
                  price={drink.price}
                  description={drink.description}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No Hot Drinks Available</p>
        )}
      </div>
    </div>
  );
}

export default Menu;

