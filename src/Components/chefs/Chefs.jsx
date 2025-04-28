import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ThemeContext } from "../../Context/ThemeContext";
import { useSelector } from "react-redux";
import "./Chefs.css";

function Chefs() {
  const { theme } = useContext(ThemeContext);
  const currentLange = useSelector((state) => state.lange?.langue || "En");
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  const chefsData = text?.chefsData?.map((chef, index) => ({
    id: index + 1,
    image: `/Images/chefs-${index + 1}.jpg`,
    name: chef.name,
    name_ar: chef.name_ar,
    rank: chef.rank,
    rank_ar: chef.rank_ar,
    description: chef.description,
    desc_ar: chef.desc_ar,
  })) || [
    {
      id: 1,
      name: currentLange === "Ar" ? "والتر وايت" : "Walter White",
      name_ar: "والتر وايت",
      rank: currentLange === "Ar" ? "شيف رئيسي" : "Master Chef",
      rank_ar: "شيف رئيسي",
      description: currentLange === "Ar" ? "يهرب من أجل ذلك وذلك. متعة مؤلمة في الوقت الذي تستمر فيه بنفسها. ممارسة الحد الأدنى من الجسم والمتعة." : "Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enim corporis et voluptate.",
      desc_ar: "يهرب من أجل ذلك وذلك. متعة مؤلمة في الوقت الذي تستمر فيه بنفسها. ممارسة الحد الأدنى من الجسم والمتعة.",
      image: "/Images/chefs-1.jpg",
    },
    {
      id: 2,
      name: currentLange === "Ar" ? "سارة جونسون" : "Sarah Jhonson",
      name_ar: "سارة جونسون",
      rank: currentLange === "Ar" ? "حلواني" : "Patissier",
      rank_ar: "حلواني",
      description: currentLange === "Ar" ? "لأنه يصد. هو واتهاماته يهربون من الحد الأدنى من الجسم. متعة يتم رفضها ولا يعقل الحكيم." : "Quo esse repellendus quia id. Est eum et accusantium pariatur fugit nihil minima suscipit corporis. Voluptate sed quas reiciendis animi neque sapiente.",
      desc_ar: "لأنه يصد. هو واتهاماته يهربون من الحد الأدنى من الجسم. متعة يتم رفضها ولا يعقل الحكيم.",
      image: "/Images/chefs-2.jpg",
    },
    {
      id: 3,
      name: currentLange === "Ar" ? "ويليام أندرسون" : "William Anderson",
      name_ar: "ويليام أندرسون",
      rank: currentLange === "Ar" ? "طباخ" : "Cook",
      rank_ar: "طباخ",
      description: currentLange === "Ar" ? "كل شيء حقيقي بالتأكيد. متعة يتم وصفها بالمضايقة. متعة بالفعل للمهندس الذي يعاني من التعديلات." : "Vero omnis enim consequatur. Voluptas consectetur unde qui molestiae deserunt. Voluptates enim aut architecto porro aspernatur molestiae modi.",
      desc_ar: "كل شيء حقيقي بالتأكيد. متعة يتم وصفها بالمضايقة. متعة بالفعل للمهندس الذي يعاني من التعديلات.",
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
          {/* <h2 className="chef-head display-4">
            {text?.chefsTitle || (currentLange === "Ar" ? "الطهاة" : "CHEFS")}
          </h2> */}
          <h3 className="h1">
            {text?.professionalChefs || (currentLange === "Ar" ? "طهاتنا المحترفون" : "Our Professional Chefs")}{" "}
            {/* <span className="text-danger">
              {currentLange === "Ar" ? "المحترفون" : "Professional"}
            </span> */}
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
                  className="img-holder text-center rounded-circle mx-auto w-100"
                  style={{ width: "250px", height: "250px" }}
                >
                  <img
                    className="chef-img p-4 object-fit-cover"
                    src={chef.image}
                    alt={currentLange === "Ar" ? chef.name_ar : chef.name}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className={`card-body text-center ${textColor}`}>
                  <h5 className={`card-title chef-name ${textColor}`}>
                    {currentLange === "Ar" ? chef.name_ar : chef.name}
                  </h5>
                  <p className="card-text chef-rank text-danger">
                    {currentLange === "Ar" ? chef.rank_ar : chef.rank}
                  </p>
                  <p className={`card-text chef-disc ${textColor}`}>
                    {currentLange === "Ar" ? chef.desc_ar : chef.description}
                  </p>
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
