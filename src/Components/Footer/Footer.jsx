    import React from "react";
    import "./Footer.css"; // Import the CSS file for styling

    function Footer() {
    return (
        <footer className="footer py-5 bg-dark text-white">
        <div className="container">
            <div className="row">
            {/* Column 1: Logo and Description */}
            <div className="col-md-4 mb-4">
                <div className="d-flex align-items-center mb-3">
                
                <h2 className="text-uppercase mb-0">Restaurant</h2>
                </div>
                <p className="text-white">
                Mealify is a restaurant landing page that offers a delicious dining experience to its customers.
                </p>
                <h4 className="text-uppercase mb-3">Social Media</h4>
                <ul className="list-inline social-list">
                <li className="list-inline-item">
                    <a href="#" className="text-white">
                    <i className="fab fa-twitter fa-lg"></i>
                    </a>
                </li>
                <li className="list-inline-item">
                    <a href="#" className="text-white">
                    <i className="fab fa-facebook fa-lg"></i>
                    </a>
                </li>
                <li className="list-inline-item">
                    <a href="#" className="text-white">
                    <i className="fab fa-instagram fa-lg"></i>
                    </a>
                </li>
                <li className="list-inline-item">
                    <a href="#" className="text-white">
                    <i className="fab fa-linkedin fa-lg"></i>
                    </a>
                </li>
                </ul>
            </div>

            {/* Column 2: Newsletter and Quick Links */}
            <div className="col-md-4 mb-4 text-white">
                <h3 className="text-uppercase mb-3">Subscribe Our Newsletter</h3>
                <p className="text-white mb-3">
                Don't miss out on our latest menu updates and exclusive offers - join our newsletter today and stay up-to-date with all things Mealify!
                </p>
                <div className="input-group mb-3">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email address"
                />
                <button className="btn btn-danger" type="button">
                    Subscribe
                </button>
                </div>
                <h4 className="text-uppercase mb-3">Quick Links</h4>
                <div className="row">
                <div className="col-6">
                    <ul className="list-unstyled text-white">
                    <li>
                        <a href="#" className="text-white text-decoration-none">
                        <i className="fas fa-share me-2"></i>About Us
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-white text-decoration-none">
                        <i className="fas fa-share me-2"></i>Contact
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-white text-decoration-none">
                        <i className="fas fa-share me-2"></i>Testimonial
                        </a>
                    </li>
                    </ul>
                </div>
                <div className="col-6">
                    <ul className="list-unstyled">
                    <li>
                        <a href="#" className="text-white text-decoration-none">
                        <i className="fas fa-share me-2"></i>Our Partners
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-white text-decoration-none">
                        <i className="fas fa-share me-2"></i>FAQ
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-white text-decoration-none">
                        <i className="fas fa-share me-2"></i>Privacy Policy
                        </a>
                    </li>
                    </ul>
                </div>
                </div>
            </div>

            {/* Column 3: Contact Information */}
            <div className="col-md-4 mb-4">
                <h2 className="text-uppercase mb-3">Get in Touch</h2>
                <ul className="list-unstyled">
                <li className="mb-3">
                    <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                    <span>A108 Adam Street, New York, NY 535022</span>
                </li>
                <li className="mb-3">
                    <i className="fas fa-envelope me-2 text-danger"></i>
                    <span>contact@example.com</span>
                </li>
                <li className="mb-3">
                    <i className="fas fa-phone me-2 text-danger"></i>
                    <span>+1 5589 55488 55</span>
                </li>
                </ul>
            </div>
            </div>
        </div>
        </footer>
    );
    }

    export default Footer;