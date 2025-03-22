import { useState, useEffect } from "react";
import { db, getDocs, collection} from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import './Menu.css'
import { Navigation, FreeMode } from "swiper/modules";
import Card from "../../Components/Card/card";

function Menu() {
  const navigate = useNavigate();

  // 🟢 تعريف ستايت لكل كاتيجوري
  const [mexican, setMexican] = useState([]);
  const [sandwiches, setSandwiches] = useState([]);
  const [pizza, setPizza] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    const getCategoryData = async (category, setCategory, imageKey) => {
      const itemsCollectionRef = collection(db, "menu", category, "items");
      const querySnapshot = await getDocs(itemsCollectionRef);

      const dishesData = querySnapshot.docs.map((doc) => {
        const dishData = doc.data();
        return {
          id: doc.id,
          name: dishData.name || "Unnamed Dish",
          // image: Array.isArray(dishData[imageKey]) && dishData[imageKey][1]
          //   ? dishData[imageKey][1]["lg"]
          //   : dishData[imageKey] || "default-image.jpg",
        };
      });

      setCategory(dishesData);
    };

    getCategoryData("mexican", setMexican, "image");
    getCategoryData("sandwiches", setSandwiches, "images");
    getCategoryData("pizaa", setPizza, "img");
    getCategoryData("beef sandwich", setDrinks, "image");
    getCategoryData("chicken  sandwich", setDesserts, "image");
  }, []);

  const handleNavigate = (id) => {
    navigate(`/Dishes/${id}`);
  };

  return (
    <div className="menu-container container mx-auto text-white mt-5">
      <h1 className="text-center menu-title ">Menu <span className="text-danger">Categories</span> </h1>

      {/* 🥪 Mexican Section */}
      <div className="category-section mt-5">
        <div className="category-header align-items-center d-flex justify-content-between">
          <h2>Mexican</h2>
          <a onClick={() => handleNavigate("mexican")} className="see-all-btn  text-decoration-none">
            See All<span> <i className="fa-solid fa-greater-than"></i></span>
          </a>
        </div>

        {mexican.length > 0 ? (
          <Swiper
            modules={[Navigation, FreeMode]}
            navigation
            freeMode={true}
            loop={true}
            speed={600}
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={{
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 4 },
            }}
            className="category-slider"
          >
            {mexican.map((dish) => (
              <SwiperSlide key={dish.id}>
                <Card poster_path={dish.image} title={dish.name} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No Dishes Available</p>
        )}
      </div>
      {/* 🥪 Sandwiches Section */}
      <div className="category-section mt-5">
        <div className="category-header align-items-center d-flex justify-content-between">
          <h2>Sandwiches</h2>
          <a onClick={() => handleNavigate("sandwiches")} className="see-all-btn  text-decoration-none">
            See All<span> <i className="fa-solid fa-greater-than"></i></span>
          </a>
        </div>

        {sandwiches.length > 0 ? (
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
            {sandwiches.map((dish) => (
              <SwiperSlide key={dish.id}>
                <Card poster_path={dish.image} title={dish.name} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No Dishes Available</p>
        )}
      </div>

      {/* 🍕 Pizza Section */}
      <div className="category-section mt-5">
        <div className="category-header align-items-center d-flex justify-content-between">
          <h2>Pizza</h2>
          <a onClick={() => handleNavigate("pizaa")} className="see-all-btn   text-decoration-none">
            See All <span> <i className="fa-solid fa-greater-than"></i></span>
          </a>
        </div>

        {pizza.length > 0 ? (
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
            {pizza.map((dish) => (
              <SwiperSlide key={dish.id}>
                <Card poster_path={dish.image} title={dish.name} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No Dishes Available</p>
        )}
      </div>

      {/* 🍰 Drinks Section */}
      <div className="category-section mt-5 mb-5">
        <div className="category-header align-items-center d-flex justify-content-between">
          <h2>drinks</h2>
          <a onClick={() => handleNavigate("drinks")} className="see-all-btn   text-decoration-none">
            See All <span> <i className="fa-solid fa-greater-than"></i></span>
          </a>
        </div>

        {drinks.length > 0 ? (
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
            {drinks.map((dish) => (
              <SwiperSlide key={dish.id}>
                <Card poster_path={dish.image} title={dish.name} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No Dishes Available</p>
        )}
      </div>
      {/* 🍰 Desserts Section */}
      <div className="category-section mt-5 mb-5">
        <div className="category-header align-items-center d-flex justify-content-between">
          <h2>Desserts</h2>
          <a onClick={() => handleNavigate("desserts")} className="see-all-btn   text-decoration-none">
            See All <span> <i className="fa-solid fa-greater-than"></i></span>
          </a>
        </div>

        {desserts.length > 0 ? (
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
            {desserts.map((dish) => (
              <SwiperSlide key={dish.id}>
                <Card poster_path={dish.image} title={dish.name} price={dish.price} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No Dishes Available</p>
        )}
      </div>
    </div>
  );
}

export default Menu;
