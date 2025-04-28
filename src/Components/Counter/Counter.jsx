import React, { useEffect, useRef, useState, useContext } from 'react';
import './Counter.css';
import { ThemeContext } from "../../Context/ThemeContext";
import { useSelector } from "react-redux";

function Counter() {
  const { theme } = useContext(ThemeContext);
  const currentLange = useSelector((state) => state.lange?.langue || "En");
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const sectionRef = useRef(null);
  const [counters, setCounters] = useState({
    clients: 0,
    meals: 0,
    dishes: 0,
    rate: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            animateNumbers();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const animateNumbers = () => {
    const targetValues = {
      clients: 1000,
      meals: 5000,
      dishes: 100,
      rate: 4.8,
    };

    const duration = 3000;
    const increment = 20;

    Object.keys(targetValues).forEach((key) => {
      const target = targetValues[key];
      const steps = duration / increment;
      const stepValue = target / steps;

      let current = 0;
      const interval = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setCounters((prev) => ({
          ...prev,
          [key]: key === 'rate' ? current.toFixed(1) : Math.round(current),
        }));
      }, increment);
    });
  };

  const textColor = theme === "dark" ? "text-white" : "text-dark";

  return (
    <div
      ref={sectionRef}
      className={`count w-100 py-5 ${
        theme === "dark" ? "bg-custom-dark" : "bg-custom-light"
      } ${isVisible ? 'animate-section' : ''}`}
    >
      <div className="container">
        <h2 className={`text-center mb-5 about-title ${textColor}`}>
          {text?.aboutUs || (currentLange === "Ar" ? "نبذة" : "About")}{" "}
          {/* <span className="text-danger">
            {currentLange === "Ar" ? "نحن" : "Us"}
          </span> */}
        </h2>
        <div className="row g-4 justify-content-center text-center">
          <div className={`col-6 col-md-3 mb-4 ${isVisible ? 'animate-icon' : ''}`}>
            <div className="counter-item">
              <i className={`fa-solid fa-users fs-1 mb-3 ${textColor}`}></i>
              <h2 className={textColor}>{counters.clients}+</h2>
              <h4 className="text-danger">
                {text?.happyClients || (currentLange === "Ar" ? "عملاء سعداء" : "Happy Clients")}
              </h4>
            </div>
          </div>
          <div className={`col-6 col-md-3 mb-4 ${isVisible ? 'animate-icon' : ''}`}>
            <div className="counter-item">
              <i className={`fa-solid fa-truck-fast fs-1 mb-3 ${textColor}`}></i>
              <h2 className={textColor}>{counters.meals}</h2>
              <h4 className="text-danger">
                {text?.mealDelivered || (currentLange === "Ar" ? "وجبات تم توصيلها" : "Meal Delivered")}
              </h4>
            </div>
          </div>
          <div className={`col-6 col-md-3 mb-4 ${isVisible ? 'animate-icon' : ''}`}>
            <div className="counter-item">
              <i className={`fa-solid fa-utensils fs-1 mb-3 ${textColor}`}></i>
              <h2 className={textColor}>{counters.dishes}+</h2>
              <h4 className="text-danger">
                {text?.differentDishes || (currentLange === "Ar" ? "أطباق متنوعة" : "Different Dishes")}
              </h4>
            </div>
          </div>
          <div className={`col-6 col-md-3 mb-4 ${isVisible ? 'animate-icon' : ''}`}>
            <div className="counter-item">
              <i className={`fa-solid fa-star fs-1 mb-3 ${textColor}`}></i>
              <h2 className={textColor}>{counters.rate}</h2>
              <h4 className="text-danger">
                {text?.rate || (currentLange === "Ar" ? "التقييم" : "Rate")}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Counter;