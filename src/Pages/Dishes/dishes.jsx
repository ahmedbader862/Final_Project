import { useState, useEffect, useContext } from 'react';
import { db, collection, getDocs } from '../../firebase/firebase';
import { useParams } from 'react-router-dom';
import Card from '../../Components/Card/card';
import '../Dishes/dishes.css';
import { ThemeContext } from '../../Context/ThemeContext';

function Dishes() {
  const { id } = useParams();
  const [dishes, setDishes] = useState([]);
  const [imageKey, setImageKey] = useState('image');
  const [titleKey, setTitleKey] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (id === 'sandwiches') {
      setImageKey('images');
      setTitleKey('name');
    } else if (id === 'pizaa' || id === 'desserts') {
      setImageKey('image');
      setTitleKey('title');
    }

    const getDishes = async () => {
      try {
        const dishesCollectionRef = collection(db, "menu", id, "items");
        const querySnapshot = await getDocs(dishesCollectionRef);

        const dishesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDishes(dishesData);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    getDishes();
  }, [id]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDishes = dishes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dishes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Theme-based classes
  const bgColor = theme === "dark" ? "bg-custom-dark" : "bg-custom-light";
  const textColor = theme === "dark" ? "text-dark" : "text-white";

  const paginationBg = theme === "dark" ? "bg-dark text-white border-secondary" : "";
  const activePage = theme === "dark" ? "bg-secondary text-white border-0" : "bg-light text-dark";

  return (
    <div className={`dishes ${bgColor} ${textColor}`}>
      <div className="container py-5">
        <div className="row g-4 mt-5">
          {currentDishes.map((dish) => (
            <div className="col-12 col-md-6 col-lg-4" key={dish.id}>
              <Card
                title={dish[titleKey]}
                poster_path={
                  Array.isArray(dish[imageKey])
                    ? dish[imageKey][1]?.lg || ''
                    : dish[imageKey]
                }
                price={dish.price}
                description={dish.description}
              />
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-5">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className={`page-link ${paginationBg}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  <button
                    className={`page-link ${paginationBg} ${currentPage === index + 1 ? activePage : ''}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className={`page-link ${paginationBg}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export default Dishes;
