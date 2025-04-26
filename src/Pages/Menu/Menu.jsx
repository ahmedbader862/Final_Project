import { useState, useEffect, useContext } from "react";
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
import { ThemeContext } from "../../Context/ThemeContext";
import { useSelector } from "react-redux";

function Menu() {
  const navigate = useNavigate();

  const [softDrinks, setSoftDrinks] = useState([]);
  const [chickenSandwiches, setChickenSandwiches] = useState([]);
  const [beefSandwiches, setBeefSandwiches] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [hotDrinks, setHotDrinks] = useState([]);
  const { theme } = useContext(ThemeContext);
  const currentLange = useSelector((state) => state.lange?.langue || "en");
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  useEffect(() => {
    const getCategoryData = async (category, setCategory) => {
      try {
        const itemsCollectionRef = collection(db, "menu", category, "items");
        const querySnapshot = await getDocs(itemsCollectionRef);

        const categoryData = querySnapshot.docs.map((doc) => {
          const itemData = doc.data();
          return {
            id: doc.id,
            title: itemData.title || "Title not available",
            title_ar: itemData.title_ar || itemData.name_ar || "عنوان غير متوفر",
            description: itemData.description || "Description not available",
            desc_ar: itemData.desc_ar || "الوصف غير متوفر",
            image: itemData.image || "default-image.jpg",
            price: itemData.price || "Price not available",
          };
        });

        setCategory(categoryData);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
      }
    };

    getCategoryData("chicken sandwich", setChickenSandwiches);
    getCategoryData("beef sandwich", setBeefSandwiches);
    getCategoryData("pizaa", setPizzas);
    getCategoryData("soft drinks", setSoftDrinks);
    getCategoryData("hotDrinks", setHotDrinks);
  }, []);

  const handleAddToCart = (item) => {
    const displayTitle = currentLange === "ar" ? item.title_ar : item.title;
    toast.success(`${displayTitle} أضيف إلى العربة!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleAddToWishlist = (item) => {
    const displayTitle = currentLange === "ar" ? item.title_ar : item.title;
    toast.info(`${displayTitle} أضيف إلى قائمة الرغبات!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const backgroundColor = theme === "dark" ? "bg-custom-dark" : "bg-custom-light";

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
          {text.seeAll} <span><i className="fa-solid fa-greater-than"></i></span>
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
                title_ar={item.title_ar}
                price={item.price}
                description={item.description}
                desc_ar={item.desc_ar}
                onAddToCart={() => handleAddToCart(item)}
                onAddToWishlist={() => handleAddToWishlist(item)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>{text.noItems}</p>
      )}
    </div>
  );

  return (
    <div className={`menu-container ${backgroundColor} ${textColor} mt-5`}>
      <div className="container">
        <h1 className="text-center menu-title">
          {text.menuTitle}
        </h1>
        {renderCategorySection(text.chickenSandwiches, chickenSandwiches, "chicken sandwich")}
        {renderCategorySection(text.beefSandwiches, beefSandwiches, "beef sandwich")}
        {renderCategorySection(text.pizzas, pizzas, "pizaa")}
        {renderCategorySection(text.softDrinks, softDrinks, "soft drinks")}
        {renderCategorySection(text.Drinks, hotDrinks, "hotDrinks")}
        <ToastContainer />
      </div>
    </div>
  );
}

export default Menu;