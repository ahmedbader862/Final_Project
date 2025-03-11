import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Hero.css"; // Optional: Add styling if needed

function Hero() {
  const texts = ["Meals", "Desserts", "Appetizers"];
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const typingSpeed = 150; // Speed of typing
  const deletingSpeed = 100; // Speed of deleting
  const pauseTime = 1000; // Pause before deleting

  useEffect(() => {
    let typingTimeout;

    if (!isDeleting && charIndex < texts[index].length) {
      typingTimeout = setTimeout(() => {
        setDisplayText((prev) => prev + texts[index][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
      typingTimeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      }, deletingSpeed);
    } else if (charIndex === texts[index].length) {
      setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (charIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }

    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, index]);

  return (
    <div className="hero-container">
      <div className="homepage">
        {/* Background image */}
        <motion.img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80"
          alt="Background"
          className="background-image"
        />

        {/* Black overlay */}
        <div className="background-overlay"></div>

        {/* Main content */}
        <div className="content text-center">
          <h1 className="display-4 text-white">The Original Food Taste</h1>
          <h2 className="text-white">
            Try our <span className="rotating-text">{displayText}</span>
            <span className="cursor">|</span> {/* Blinking cursor effect */}
          </h2>
        </div>

        {/* Scroll icon */}
        <div className="scroll-icon">
          <i className="fas fa-chevron-down"></i> {/* Font Awesome scroll icon */}
        </div>
      </div>
    </div>
  );
}

export default Hero;
