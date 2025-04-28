import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ThemeContext } from "../../Context/ThemeContext";
import "./Chefs.css";

function Chefs() {
  const { theme } = useContext(ThemeContext);

  const chefsData = [
    {
      id: 1,
      name: "Walter White",
      rank: "Master Chef",
      description:
        "Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enim corporis et voluptate.",
      image: "/Images/chefs-1.jpg",
    },
    {
      id: 2,
      name: "Sarah Jhonson",
      rank: "Patissier",
      description:
        "Quo esse repellendus quia id. Est eum et accusantium pariatur fugit nihil minima suscipit corporis. Voluptate sed quas reiciendis animi neque sapiente.",
      image: "/Images/chefs-2.jpg",
    },
    {
      id: 3,
      name: "William Anderson",
      rank: "Cook",
      description:
        "Vero omnis enim consequatur. Voluptas consectetur unde qui molestiae deserunt. Voluptates enim aut architecto porro aspernatur molestiae modi.",
      image: "/Images/chefs-3.jpg",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const textColor = theme === "dark" ? "text-white" : "text-dark";

  return (
    <section
      className={`chefs w-100 py-5 ${
        theme === "dark" ? "bg-custom-dark" : "bg-custom-light"
      }`}
      id="chefs"
      ref={ref}
    >
      <div className="container">
        <div className={`chef-topic text-center mb-5 ${textColor}`}>
          <h2 className="chef-head display-4">CHEFS</h2>
          <h3 className="h1">
            Our <span className="text-danger">Professional</span> Chefs
          </h3>
        </div>
        <div className="row items-center">
          {chefsData.map((chef) => (
            <motion.div
              key={chef.id}
              className="col-md-6 col-lg-4 col-sm-12 mb-4"
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ delay: chef.id * 0.2 }}
            >
              <div
                className={`card h-100 ${
                  theme === "dark" ? "bg-dark" : "bg-light"
                } ${textColor}`}
              >
                <div
                  className="img-holder text-center  rounded-circle mx-auto w-100 "
                  style={{ width: "250px", height: "250px" }}
                >
                  <img
                    className="chef-img  p-4   object-fit-cover"
                    src={chef.image}
                    alt={chef.name}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className={`card-body text-center ${textColor}`}>
                  <h5 className={`card-title chef-name ${textColor}`}>{chef.name}</h5>
                  <p className="card-text chef-rank text-danger">{chef.rank}</p>
                  <p className={`card-text chef-disc ${textColor}`}>{chef.description}</p>
                  <ul className="social list-inline">
                    {["twitter", "facebook", "instagram", "linkedin"].map(
                      (platform) => (
                        <li key={platform} className="list-inline-item">
                          <i
                            className={`fab fa-${platform} fs-5 ${textColor}`}
                          ></i>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Chefs;
