    import React from "react";
    import { motion } from "framer-motion";
import Home from "../Home/Home";
import { Navigate, useNavigate } from "react-router-dom";

    const WelcomePage = () => {
        const Navigate = useNavigate(); // Initialize navigate function

    return (
        <div className="welcome-container position-relative vh-100 d-flex justify-content-center align-items-center overflow-hidden">
        <div className="overlay position-absolute top-0 start-0 w-100 h-100 bg-black opacity-75"></div>

        <motion.img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Restaurant Food"
            className="background-image position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-n1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
        />

        <motion.div
            className="welcome-content text-center text-white z-1"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
        >
            <h1 className="display-3 fw-bold mb-3">Welcome to Our Restaurant</h1>
            <p className="fs-4 mb-4">Experience the finest cuisine in town</p>
            <div className="buttons d-flex gap-3 justify-content-center">
            <motion.button
            ref={Home}
                className="btn btn-outline-light btn-lg position-relative overflow-hidden"
                whileHover={{
                scale: 1.02,
                backgroundColor: "#ffffff",
                color: "#000000",
                transition: { duration: 0.15 },
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onClick={() => Navigate("/")}
                
            >
                <span className="position-relative z-1">Get Started</span>
                <motion.span
                className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-0"
                whileHover={{ opacity: 0.1, transition: { duration: 0.2 } }}
                />
                <i className="ms-2 fa-solid fa-arrow-right"></i>
            </motion.button>

            {/* Sign In Button */}
            <motion.button
                className="btn btn-outline-light btn-lg position-relative overflow-hidden"
                whileHover={{
                scale: 1.02,
                backgroundColor: "#ffffff",
                color: "#000000",
                transition: { duration: 0.15 },
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onClick={() => Navigate("/signin")}
            >
                <span className="position-relative z-1">Sign In</span>
                <motion.span
                className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-0"
                whileHover={{ opacity: 0.1, transition: { duration: 0.2 } }}
                />
            </motion.button>
            </div>
        </motion.div>
        </div>
    );
    };

    export default WelcomePage;