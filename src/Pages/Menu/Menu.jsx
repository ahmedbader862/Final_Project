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
  const currentLange = useSelector((state) => state.lange?.langue || 'en');
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState({});

  // Helper function to format document IDs into proper titles
  const formatCategoryTitle = (id) => {
    return id
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    const unsubscribeCategories = onSnapshot(
      collection(db, 'menu'),
      (snapshot) => {
        const loadedCategories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(loadedCategories);
      },
      (error) => {
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
    const unsubscribes = categories.map((category) => {
      const itemsCollectionRef = collection(db, `menu/${category.id}/items`);
      return onSnapshot(
        itemsCollectionRef,
        (snapshot) => {
          const categoryData = snapshot.docs.map((doc) => {
            const itemData = doc.data();
            let parsedCreatedAt = null;
            if (itemData.createdAt) {
              try {
                parsedCreatedAt = itemData.createdAt.toDate ? itemData.createdAt.toDate() : new Date(itemData.createdAt);
                if (isNaN(parsedCreatedAt.getTime())) {
                  console.warn(`Invalid createdAt for item ${doc.id}:`, itemData.createdAt);
                  parsedCreatedAt = null;
                }
              } catch (error) {
                console.error(`Error parsing createdAt for item ${doc.id}:`, error);
                parsedCreatedAt = null;
              }
            } else {
              console.warn(`No createdAt field for item ${doc.id}`);
            }
            return {
              id: doc.id,
              title: itemData.title || 'Title not available',
              title_ar: itemData.title_ar || itemData.name_ar || 'عنوان غير متوفر',
              description: itemData.description || 'Description not available',
              desc_ar: itemData.desc_ar || 'الوصف غير متوفر',
              image: itemData.image || '/Images/default-image.jpg',
              price: itemData.price || 'Price not available',
              createdAt: parsedCreatedAt,
              rawCreatedAt: itemData.createdAt,
            };
          });
          console.log(`Timestamps for category ${category.id} before sorting:`, 
            categoryData.map(item => ({
              id: item.id,
              title: item.title,
              createdAt: item.createdAt ? item.createdAt.toISOString() : 'null',
              rawCreatedAt: item.rawCreatedAt,
            }))
          );
          const sortedCategoryData = categoryData.sort((a, b) => {
            const timeA = a.createdAt ? a.createdAt.getTime() : 0;
            const timeB = b.createdAt ? b.createdAt.getTime() : 0;
            return timeB - timeA;
          });
          console.log(`Sorted items for category ${category.id}:`, 
            sortedCategoryData.map(item => ({
              id: item.id,
              title: item.title,
              createdAt: item.createdAt ? item.createdAt.toISOString() : 'null',
            }))
          );
          setMenuItems((prev) => ({
            ...prev,
            [category.id]: sortedCategoryData,
          }));
        },
        (error) => {
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

  const textColor = theme === 'dark' || theme === 'darkTheme' ? 'text-white' : 'text-dark';
  const backgroundColor = theme === 'dark' || theme === 'darkTheme' ? 'bg-custom-dark' : 'bg-custom-light';

  const handleNavigate = (category) => {
    navigate(`/Dishes/${category}`);
  };

  const renderCategorySection = (title, items, categoryKey) => (
    <div className="category-section mt-5">
      <h2 className={`category-title ${textColor} mb-3`}>
        {title}
      </h2>
      <div className="category-header align-items-center d-flex justify-content-end cursor-pointer">
        <a
          onClick={() => handleNavigate(categoryKey)}
          className="see-all-btn text-danger text-decoration-none mb-3"
        >
          {text?.seeAll || (currentLange === 'Ar' ? 'عرض الكل' : 'See All')}{' '}
          <span>
            <i className="fa-solid fa-greater-than cursor-pointer"></i>
          </span>
        </a>
      </div>

      {items && items.length > 0 ? (
        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          loop={true}
          speed={600}
          spaceBetween={15}
          slidesPerView={3}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            576: { slidesPerView: 2, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 12 },
            1024: { slidesPerView: 3, spaceBetween: 15 },
            1280: { slidesPerView: 3, spaceBetween: 15 },
          }}
          className="category-slider"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="card-wrapper">
                <Card
                  poster_path={item.image}
                  title={item.title}
                  title_ar={item.title_ar}
                  price={item.price}
                  description={item.description}
                  desc_ar={item.desc_ar}
                  onAddToCart={() => handleAddToCart(item)}
                  onAddToWishlist={() => handleAddToWishlist(item)}
                  theme={theme}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className={textColor}>
          {text?.noItems || (currentLange === 'Ar' ? 'لا توجد عناصر' : 'No items available')}
        </p>
      )}
    </div>
  );

  return (
    <div className={`menu-container ${backgroundColor} ${textColor} py-5 mt-5`}>
      <div className="container">
        <h1 className={`text-center menu-title ${textColor}`}>
          <span>{currentLange === 'Ar' ? 'قائمة' : 'Our'}</span>
          <span className="text-danger"> {currentLange === 'Ar' ? 'الطعام' : 'Menu'}</span>
        </h1>
        {categories.map((category) =>
          renderCategorySection(
            category.name || formatCategoryTitle(category.id) || 'Unknown Category', // Always use English title
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