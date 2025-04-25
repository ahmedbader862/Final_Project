import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { db, collection, getDocs } from "../firebase/firebase";
import Card from "../Components/Card/card";
import { toast } from "react-toastify";
import { ThemeContext } from "../Context/ThemeContext";

function SearchResults() {
  const { theme } = useContext(ThemeContext);
  const { term } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const categories = [
          "chicken sandwich",
          "beef sandwich",
          "pizaa",
          "soft drinks",
          "drinks",
        ];

        let allResults = [];

        for (const category of categories) {
          const itemsCollectionRef = collection(db, "menu", category, "items");
          const querySnapshot = await getDocs(itemsCollectionRef);

          const categoryData = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              title: doc.data().title || "Unnamed Item",
              description: doc.data().description || "No description available",
              image: doc.data().image || "default-image.jpg",
              price: doc.data().price || "Price not available",
            }))
            .filter((item) =>
              item.title.toLowerCase().includes(term.toLowerCase())
            );

          allResults = [...allResults, ...categoryData];
        }

        setResults(allResults);
      } catch (err) {
        console.error("Error fetching search results:", err);
        toast.error("Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };

    if (term) {
      fetchResults();
    }
  }, [term]);

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

  const bgClass = theme === "dark" ? "bg-dark text-white" : "bg-light text-dark";

  return (
    <div className={` mt-5 pt-5 ${bgClass}`} style={{ minHeight: "100vh" }}>
      <div className="container">
      <h2 className="mb-4">Search Results for "<span style={{ color: "#ff6b6b", fontWeight: "bold" }} className="text-primary">{term}</span>"</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="row">
          {results.map((item) => (
            <div key={item.id} className="col-md-4 mb-4">
              <Card
                poster_path={item.image}
                title={item.title}
                price={item.price}
                description={item.description}
                onAddToCart={() => handleAddToCart(item)}
                onAddToWishlist={() => handleAddToWishlist(item)}
              />
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default SearchResults;
