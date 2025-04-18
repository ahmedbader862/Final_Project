// import { motion } from "framer-motion";
// import ImageWithFallback from "./ImageWithFallback";

// const AboutUs = () => {
//   return (
//     <section className="flex flex-col md:flex-row items-center px-8 gap-8">
//       <motion.div
//         initial={{ x: 200, opacity: 0 }}
//         whileInView={{ x: 0, opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 1.5 }}
//         className="w-full md:w-1/2"
//       >
//         <ImageWithFallback
//           src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&h=600&fit=crop"
//           alt="Our Restaurant"
//           className="w-full rounded-xl shadow-xl object-cover"
//           width={800}
//           height={600}
//           loading="lazy"
//         />
//       </motion.div>
//       <motion.div
//         initial={{ x: -200, opacity: 0 }}
//         whileInView={{ x: 0, opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 1.5 }}
//         className="w-full md:w-1/2"
//       >
//         <h2 className="text-3xl font-bold mb-4 text-gray-800">About Us</h2>
//         <p className="text-lg text-gray-600 leading-relaxed">
//           Welcome to our restaurant! We serve delicious dishes prepared with love and the freshest ingredients. Our passionate chefs craft each meal to perfection, ensuring a memorable dining experience. Come and enjoy our cozy atmosphere and exceptional service.
//         </p>
//       </motion.div>
//     </section>
//   );
// };

// export default AboutUs;