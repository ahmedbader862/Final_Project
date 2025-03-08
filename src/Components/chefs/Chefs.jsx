import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./Chefs.css"; // Custom CSS for animations and hover effects

function Chefs() {
  const chefsData = [
    {
      id: 1,
      name: "Walter White",
      rank: "Master Chef",
      description:
        "Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enim corporis et voluptate.",
      image: "../../../Images/chefs-1.jpg",
    },
    {
      id: 2,
      name: "Sarah Jhonson",
      rank: "Patissier",
      description:
        "Quo esse repellendus quia id. Est eum et accusantium pariatur fugit nihil minima suscipit corporis. Voluptate sed quas reiciendis animi neque sapiente.",
      image: "../../../Images/chefs-2.jpg",
    },
    {
      id: 3,
      name: "William Anderson",
      rank: "Cook",
      description:
        "Vero omnis enim consequatur. Voluptas consectetur unde qui molestiae deserunt. Voluptates enim aut architecto porro aspernatur molestiae modi.",
      image: "../../../Images/chefs-3.jpg",
    },
  ];

  // Animation variants for the cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Use useInView to detect when the section is in view
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="chefs text-white py-5" id="chefs" ref={ref}>
      <div className="container">
        <div className="chef-topic text-center mb-5">
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
              transition={{ delay: chef.id * 0.2 }} // Staggered delay
            >
              <div className="card h-100 bg-dark text-white">
                <div className="img-holder overflow-hidden rounded-circle mx-auto mt-3" style={{ width: "250px", height: "250px" }}>
                  <img className="chef-img w-100 h-100 object-fit-cover" src={chef.image} alt={chef.name} />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title chef-name">{chef.name}</h5>
                  <p className="card-text chef-rank text-danger">{chef.rank}</p>
                  <p className="card-text chef-disc">{chef.description}</p>
                  <ul className="social list-inline">
                    <li className="list-inline-item">
                      <i className="fab fa-twitter"></i>
                    </li>
                    <li className="list-inline-item">
                      <i className="fab fa-facebook"></i>
                    </li>
                    <li className="list-inline-item">
                      <i className="fab fa-instagram"></i>
                    </li>
                    <li className="list-inline-item">
                      <i className="fab fa-linkedin"></i>
                    </li>
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