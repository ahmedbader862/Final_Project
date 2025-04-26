import React, { useEffect, useRef, useState, useContext } from 'react';
import './Counter.css';
import { ThemeContext } from "../../Context/ThemeContext"; // استيراد ThemeContext

function Counter() {
    const { theme } = useContext(ThemeContext); // الحصول على الـ theme الحالي
    const sectionRef = useRef(null); // Ref for the section
    const [counters, setCounters] = useState({
        clients: 0,
        meals: 0,
        dishes: 0,
        rate: 0,
    });
    const [isVisible, setIsVisible] = useState(false); // Track visibility

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true); // Set section as visible
                        animateNumbers(); // Start counting animation
                        observer.unobserve(entry.target); // Stop observing after animation
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of the section is visible
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current); // Start observing the section
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current); // Cleanup
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

        const duration = 3000; // 3 seconds
        const increment = 20; // Update every 20ms

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
                    [key]: Math.round(current),
                }));
            }, increment);
        });
    };

    return (
        <div 
            ref={sectionRef} 
            className={`  count py-5 ${theme === "dark" ? "bg-custom-dark text-white" : "bg-custom-light text-dark"} ${isVisible ? 'animate-section' : ''}`}
        >
            <div className="container">
            <h2 className='text-center mb-5'>
                About<span className='text-danger'> Us</span>
            </h2>
            <div className="row justify-content-center text-center">
                {/* Clients Counter */}
                <div className={`col-6 col-md-3 mb-4 ${isVisible ? 'animate-icon' : ''}`}>
                    <div className="icon">
                        <i className={`fa-solid fa-users fs-1 mb-2 ${theme === "dark" ? "text-white" : "text-dark"}`}></i>
                        <h3>{counters.clients}+</h3>
                        <h3 className={`text-danger ${theme === "dark" ? "text-light" : ""}`}>Happy Clients</h3>
                    </div>
                </div>
                {/* Meals Counter */}
                <div className={`col-6 col-md-3 mb-4 ${isVisible ? 'animate-icon' : ''}`}>
                    <div className="icon">
                        <i className={`fa-solid fa-truck-fast fs-1 mb-2 ${theme === "dark" ? "text-white" : "text-dark"}`}></i>
                        <h3>{counters.meals}</h3>
                        <h3 className={`text-danger ${theme === "dark" ? "text-light" : ""}`}>Meal Delivered</h3>
                    </div>
                </div>
                {/* Dishes Counter */}
                <div className={`col-6 col-md-3 mb-4 ${isVisible ? 'animate-icon' : ''}`}>
                    <div className="icon">
                        <i className={`fa-solid fa-utensils fs-1 mb-2 ${theme === "dark" ? "text-white" : "text-dark"}`}></i>
                        <h3>{counters.dishes}+</h3>
                        <h3 className={`text-danger ${theme === "dark" ? "text-light" : ""}`}>Different Dishes</h3>
                    </div>
                </div>
                {/* Rate Counter */}
                <div className={`col-6 col-md-3 mb-4 ${isVisible ? 'animate-icon' : ''}`}>
                    <div className="icon">
                        <i className={`fa-solid fa-star fs-1 mb-2 ${theme === "dark" ? "text-white" : "text-dark"}`}></i>
                        <h3>{counters.rate.toFixed(1)}</h3>
                        <h3 className={`text-danger ${theme === "dark" ? "text-light" : ""}`}>Rate</h3>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Counter;
