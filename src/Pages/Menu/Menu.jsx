import { useState, useEffect, useContext } from 'react';
import { db, collection, onSnapshot } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import './Menu.css';
import { FreeMode } from 'swiper/modules';
import Card from '../../Components/Card/card';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from '../../Context/ThemeContext';
import { useSelector } from 'react-redux';

function Menu() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const currentLange = useSelector((state) => state.lange?.langue || "en");
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState({});

  useEffect(() => {
    // Fetch categories dynamically with real-time updates
    const unsubscribeCategories = onSnapshot(
      collection(db, 'menu'),
      (snapshot) => {
        const loadedCategories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Fetched categories:', loadedCategories);
        setCategories(loadedCategories);
      },
      (error) => {
        console.error('Error fetching categories:', error);
        toast.error(
          text?.failedLoadCategories ||
            (currentLange === 'Ar' ? 'فشل في تحميل الفئات' : 'Failed to load categories'),
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    );

    return () => unsubscribeCategories();
  }, [text, currentLange]);

  useEffect(() => {
    // Set up real-time listeners for each category
    const unsubscribes = categories.map((category) => {
      const itemsCollectionRef = collection(db, `menu/${category.id}/items`);
      return onSnapshot(
        itemsCollectionRef,
        (snapshot) => {
          const categoryData = snapshot.docs.map((doc) => {
            const itemData = doc.data();
            return {
              id: doc.id,
              title: itemData.title || 'Title not available',
              title_ar: itemData.title_ar || itemData.name_ar || 'عنوان غير متوفر',
              description: itemData.description || 'Description not available',
              desc_ar: itemData.desc_ar || 'الوصف غير متوفر',
              image: itemData.image || 'default-image.jpg',
              price: itemData.price || 'Price not available',
            };
          });
          console.log(`Updated items for category ${category.id}:`, categoryData);
          setMenuItems((prev) => ({
            ...prev,
            [category.id]: categoryData,
          }));
        },
        (error) => {
          console.error(`Error fetching items for ${category.id}:`, error);
          toast.error(
            text?.failedLoadMenuItems ||
              (currentLange === 'Ar'
                ? 'فشل في تحميل عناصر القائمة'
                : 'Failed to load menu items'),
            {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }
      );
    });

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [categories, text, currentLange]);

  const handleAddToCart = (item) => {
    const displayTitle = currentLange === 'Ar' ? item.title_ar : item.title;
    toast.success(`${displayTitle} أضيف إلى العربة!`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleAddToWishlist = (item) => {
    const displayTitle = currentLange === 'Ar' ? item.title_ar : item.title;
    toast.info(`${displayTitle} أضيف إلى قائمة الرغبات!`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const textColor = theme === 'dark' ? 'text-white' : 'text-dark';
  const backgroundColor = theme === 'dark' ? 'bg-custom-dark' : 'bg-custom-light';

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
          {text?.seeAll || (currentLange === 'Ar' ? 'عرض الكل' : 'See All')}{' '}
          <span>
            <i className="fa-solid fa-greater-than"></i>
          </span>
        </a>
      </div>

      {items && items.length > 0 ? (
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
        <p>{text?.noItems || (currentLange === 'Ar' ? 'لا توجد عناصر' : 'No items available')}</p>
      )}
    </div>
  );

  return (
    <div className={`menu-container ${backgroundColor} ${textColor} mt-5`}>
      <div className="container">
        <h1 className="text-center menu-title">{text?.menuTitle || (currentLange === 'Ar' ? 'القائمة' : 'Our Menu')}</h1>
        {categories.map((category) =>
          renderCategorySection(
            currentLange === 'Ar' ? category.category_ar || category.name : category.name || category.id,
            menuItems[category.id],
            category.id
          )
        )}
        <ToastContainer />
      </div>
    </div>
  );
}

export default Menu;