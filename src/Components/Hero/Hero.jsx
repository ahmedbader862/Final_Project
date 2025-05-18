import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import "./Hero.css";

function Hero() {
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  const texts = [
    text.meals || "Meals",
    text.desserts || "Desserts",
    text.appetizers || "Appetizers",
  ];
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseTime = 1000;

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
  }, [charIndex, isDeleting, index, texts]);

  return (
    <div className="hero-container">
      <div className="homepage">
        <motion.img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80"
          alt="Background"
          className="background-image"
        />
        <div className="background-overlay"></div>
        <div className="content text-center">
          <h1 className="display-4 text-white">
            {text.theOriginalFoodTaste || "The Original Food Taste"}
          </h1>
          <h2 className="text-white">
            {text.tryOur || "Try our"}{" "}
            <span className="rotating-text">{displayText}</span>
            <span className="cursor">|</span>
          </h2>
        </div>
        <div className="scroll-icon">
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </div>
  );
}

export default Hero;
