// import { motion } from "framer-motion";
// import ImageWithFallback from "./ImageWithFallback";

// const testimonials = [
//   {
//     image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=400&fit=crop",
//     text: "Best restaurant ever! The food was amazing and the service top notch.",
//     name: "John Doe"
//   },
//   {
//     image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=400&fit=crop",
//     text: "I love the ambiance and the food quality. Will visit again!",
//     name: "Jane Smith"
//   }
// ];

// const Testimonials = () => {
//   return (
//     <section className="space-y-16">
//       {testimonials.map((testimonial, index) => (
//         <div
//           key={index}
//           className={`flex flex-col ${
//             index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
//           } items-center px-8 gap-8`}
//         >
//           <motion.div
//             initial={{ x: index % 2 === 0 ? 200 : -200, opacity: 0 }}
//             whileInView={{ x: 0, opacity: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 1.5 }}
//             className="w-full md:w-1/2"
//           >
//             <ImageWithFallback
//               src={testimonial.image}
//               alt={`${testimonial.name}'s testimonial`}
//               className="w-full rounded-xl shadow-xl object-cover"
//               width={600}
//               height={400}
//               loading="lazy"
//             />
//           </motion.div>
//           <motion.div
//             initial={{ x: index % 2 === 0 ? -200 : 200, opacity: 0 }}
//             whileInView={{ x: 0, opacity: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 1.5 }}
//             className="w-full md:w-1/2"
//           >
//             <h2 className="text-3xl font-bold mb-4 text-gray-800">
//               What Our Customers Say
//             </h2>
//             <blockquote className="text-lg text-gray-600 italic">
//               "{testimonial.text}"
//             </blockquote>
//             <p className="mt-2 text-gray-800 font-semibold">
//               - {testimonial.name}
//             </p>
//           </motion.div>
//         </div>
//       ))}
//     </section>
//   );
// };

// export default Testimonials;