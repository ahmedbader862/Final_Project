import React, { useContext } from "react";
import "./Grid.css";
import { motion } from "framer-motion";
import { ThemeContext } from "../../Context/ThemeContext"; // استيراد ال ThemeContext
import { useSelector } from "react-redux";

function Grid() {
  const { theme } = useContext(ThemeContext); // الحصول على قيمة الثيم الحالي من Context

  const galleryData = [
    {
      id: 1,
      image: "./images/meal-1.jpg",
      title: "Pizza",
      description: "Hawaiian pizza with ham and pineapple",
    },
    {
      id: 2,
      image: "./images/meal-4.jpg",
      title: "Levitation Pizza",
      description: "Levitation pizza on black background.",
    },
    {
      id: 3,
      image: "./images/meal-2.jpg",
      title: "Beef Steaks",
      description: "Tasty beef steaks flying above cast iron grate with fire flames.",
    },
    {
      id: 4,
      image: "./images/meal-7.jpg",
      title: "Frittata",
      description: "Frittata or potato pie in a ceramic plate.",
    },
    {
      id: 5,
      image: "./images/meal-3.jpg",
      title: "Burger",
      description: "Grass-fed bison hamburger with chips & beer.",
    },
    {
      id: 6,
      image: "./images/meal-6.jpg",
      title: "Lyulya Kebab",
      description: "Tender and juicy skewers of ground lamb or beef, flavored with aromatic spices and herbs.",
    },
    {
      id: 7,
      image: "./images/meal-5.jpg",
      title: "Crispy Fried Chicken",
      description: "Golden brown chicken legs with a crunchy coating and juicy meat.",
    },
  ];

  // تحديد الألوان بناءً على الثيم
  const textColor = theme === "dark" ? "white" : "black"; // لون النص
  const overlayBackground = theme === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)"; // خلفية الـ overlay

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  
  return (
    <section className={`gallery ${theme === "dark" ? "bg-custom-dark" : "bg-custom-light"}`} id="gallery">
      <div className="container text-dark">
      <motion.div
          className="g-head"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-3" style={{ color: textColor }}> {text.checkOurGallery || "Check"} </h2>
          <h3 style={{ color: textColor }}>
          {text.gallery || "GALLERY"}
          </h3>
        </motion.div>

        <motion.div
          className="g-img"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.2 }} // Starts when 20% is visible
        >
          {/* Column 1 */}
          <div className="coloum coloum1">
            {galleryData.slice(0, 2).map((item) => (
              <motion.div
                key={item.id}
                className="g-holder"
                variants={itemVariants}
              >
                <img src={item.image} alt={item.title} />
                <div className="overlay-cont" style={{ backgroundColor: overlayBackground }}>
                  <h4 style={{ color: textColor }}>{item.title}</h4>
                  <p style={{ color: textColor }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="coloum coloum2">
            {galleryData.slice(2, 4).map((item) => (
              <motion.div
                key={item.id}
                className="g-holder"
                variants={itemVariants}
              >
                <img src={item.image} alt={item.title} />
                <div className="overlay-cont" style={{ backgroundColor: overlayBackground }}>
                  <h4 style={{ color: textColor }}>{item.title}</h4>
                  <p style={{ color: textColor }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="coloum coloum3">
            {galleryData.slice(4).map((item) => (
              <motion.div
                key={item.id}
                className="g-holder"
                variants={itemVariants}
              >
                <img src={item.image} alt={item.title} />
                <div className="overlay-cont" style={{ backgroundColor: overlayBackground }}>
                  <h4 style={{ color: textColor }}>{item.title}</h4>
                  <p style={{ color: textColor }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Grid;
