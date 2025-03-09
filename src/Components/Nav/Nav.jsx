    import React, { useState } from "react";
    import "./Nav.css";
import { Link } from "react-router-dom";
import Register from "../../Pages/Register/Register";

    function Nav() {
    const [activeTab, setActiveTab] = useState("Home");
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar h-10 navbar-expand-lg fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
            {/* Brand Logo */}
            <a className="navbar-brand text-3xl text-white fw-bold" href="#">
            Restaurant
            </a>

            {/* Toggle Button for Mobile */}
            <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            >
            <span className="navbar-toggler-icon"></span>
            </button>

            {/* Navbar Links */}
            <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNavDropdown">
            <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                <Link to={"/"} className={`nav-link ${activeTab === "Home" ? "active" : ""}`} href="#" onClick={() => setActiveTab("Home")}>
                    Home
                </Link>
                </li>
                <li className="nav-item">
                <a className={`nav-link ${activeTab === "Menu" ? "active" : ""}`} href="#" onClick={() => setActiveTab("Menu")}>
                    Menu
                </a>
                </li>
                <li className="nav-item">
                <a className={`nav-link ${activeTab === "Reservation" ? "active" : ""}`} href="#" onClick={() => setActiveTab("Reservation")}>
                    Reservation
                </a>
                </li>
                <li className="nav-item">
                <a className={`nav-link ${activeTab === "Contact Us" ? "active" : ""}`} href="#" onClick={() => setActiveTab("Contact Us")}>
                    Contact Us
                </a>
                </li>
            </ul>


            <div className="d-flex align-items-center gap-4">
            <div className="icons d-flex gap-3">
                <a href="#" className="text-white fs-5"><i className="fas fa-heart"></i></a>
                <a href="#" className="text-white fs-5"><i className="fas fa-shopping-cart"></i></a>
            </div>
            <div className="buttons d-flex gap-2">
            <button className="btn btn-outline-light btn-md"><i className="fas fa-user me-2"></i>Sign In</button>
          <Link to={"/Register"}> <button className="btn btn-light btn-md"><i className="fas fa-user-plus me-2"></i>Register</button> </Link>
            </div>
            </div>
            </div>

            
        </div>
        </nav>
    );
    }

    export default Nav;
