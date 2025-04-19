import React, { useContext } from "react";
import "./Footer.css"; // Import the CSS file for styling
import QRCode from 'react-qr-code';
import { ThemeContext } from "../../Context/ThemeContext"; // استيراد ThemeContext

function Footer() {
    // الحصول على theme من context
    const { theme } = useContext(ThemeContext);

    // تحديد الألوان بناءً على الـ theme
    const backgroundColor = theme === "dark" ? "#151518" : "#f8f9fa"; // لون الخلفية
    const textColor = theme === "dark" ? "white" : "black"; // لون النصوص
    const iconColor = theme === "dark" ? "#ff6b6b" : "#ff5733"; // لون الأيقونات
    const linkColor = theme === "dark" ? "text-white" : "text-dark"; // لون الروابط

    const qrCodeUrl = "https://drive.google.com/file/d/14tz-OEZjVpH6hk4fBBl7ZZ1AGk8KnxVu/view?usp=sharing";

    return (
        <footer className={`footer py-5`} style={{ backgroundColor: backgroundColor, color: textColor }}>
            <div className="container">
                <div className="row">
                    {/* Column 1: Logo and Description */}
                    <div className="col-md-4 mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <h2 className={`text-uppercase mb-0`} style={{ color: textColor }}>Restaurant</h2>
                        </div>
                        <p className={`mb-3`} style={{ color: textColor }}>
                            TastyBites is a restaurant landing page that offers a delicious dining experience to its customers.
                        </p>
                        <h4 className={`text-uppercase mb-3`} style={{ color: textColor }}>Social Media</h4>
                        <ul className="list-inline social-list">
                            <li className="list-inline-item">
                                <a href="#" style={{ color: textColor }}>
                                    <i className={`fab fa-twitter fa-lg`} style={{ color: iconColor }}></i>
                                </a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#" style={{ color: textColor }}>
                                    <i className={`fab fa-facebook fa-lg`} style={{ color: iconColor }}></i>
                                </a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#" style={{ color: textColor }}>
                                    <i className={`fab fa-instagram fa-lg`} style={{ color: iconColor }}></i>
                                </a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#" style={{ color: textColor }}>
                                    <i className={`fab fa-linkedin fa-lg`} style={{ color: iconColor }}></i>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Newsletter and Quick Links */}
                    <div className="col-md-4 mb-4">
                        <h3 className={`text-uppercase mb-3`} style={{ color: textColor }}>Subscribe Our Newsletter</h3>
                        <p className={`mb-3`} style={{ color: textColor }}>
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
                        <h4 className={`text-uppercase mb-3`} style={{ color: textColor }}>Quick Links</h4>
                        <div className="row">
                            <div className="col-6">
                                <ul className="list-unstyled">
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>Contact
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>Testimonial
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-6">
                                <ul className="list-unstyled">
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>Our Partners
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>FAQ
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>Privacy Policy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Contact Information with QR Code */}
                    <div className="col-md-4 mb-4">
                        <h2 className={`text-uppercase mb-3`} style={{ color: textColor }}>Get in Touch</h2>
                        <ul className="list-unstyled mb-4">
                            <li className="mb-3">
                                <i className="fas fa-map-marker-alt me-2" style={{ color: iconColor }}></i>
                                <span style={{ color: textColor }}>A108 Adam Street, New York, NY 535022</span>
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-envelope me-2" style={{ color: iconColor }}></i>
                                <span style={{ color: textColor }}>contact@example.com</span>
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-phone me-2" style={{ color: iconColor }}></i>
                                <span style={{ color: textColor }}>+1 5589 55488 55</span>
                            </li>

                            <div className="qr-code-section">
                                <p className="small" style={{ color: textColor }}>Scan or click for menu</p>
                                <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <div className="qr-code-wrapper">
                                        <QRCode
                                            value={qrCodeUrl}
                                            size={120} // Smaller size to fit in column
                                            bgColor={theme === "dark" ? "#ffffff" : "#000000"}
                                            fgColor={theme === "dark" ? "#000000" : "#ffffff"}
                                            level="M"
                                        />
                                    </div>
                                </a>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
