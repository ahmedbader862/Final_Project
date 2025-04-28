import React, { useContext } from 'react';
import './General_Contacts.css';
import { ThemeContext } from "../../Context/ThemeContext";
import { useSelector } from "react-redux";

function Contact() {
    const { theme } = useContext(ThemeContext);
    const currentLange = useSelector((state) => state.lange?.langue || "En");
    const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

    const backgroundColor = theme === "dark" ? "#151518" : "#dfdede";
    const textColor = theme === "dark" ? "white" : "black";
    const iconBackgroundColor = theme === "dark" ? "#ff6b6b" : "#ff5733";
    const infoBackgroundColor = theme === "dark" ? "#26262D" : "#f1f1f1";

    return (
        <div
            className="contact pt-5"
            id="contact"
            style={{ backgroundColor: backgroundColor, color: textColor, padding: '50px 0' }}
            dir={currentLange === "Ar" ? "rtl" : "ltr"}
        >
            <div className="container">
                {/* Heading Section */}
                {/* <h2 className="text-center pb-3">
                    <span style={{ color: '#ff6b6b' }}>
                        {currentLange === "Ar" ? "عام" : "General"}
                    </span>{" "}
                    {text?.contactTitle || (currentLange === "Ar" ? "الاتصال العام" : "CONTACT")}
                </h2> */}
                <h3 className="text-center pb-4">
                    
                    <span style={{ color: '#ff6b6b' }}>
                        {currentLange === "Ar" ? "تواصل معنا" : "Contact Us"}
                    </span>
                </h3>

                {/* Google Maps Embed */}
                <div className="embed-responsive embed-responsive-16by9 mb-4">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1512.22275714285!2d-74.001975!3d40.708208!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1706553660595!5m2!1sen!2sus"
                        className="embed-responsive-item"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* Contact Information */}
                <div className="row">
                    {/* Column 1 */}
                    <div className="col-md-6 mb-4">
                        <div className="info-item d-flex align-items-center p-3 mb-3" style={{ backgroundColor: infoBackgroundColor }}>
                            <i className="fa-solid fa-map me-3" style={{ backgroundColor: iconBackgroundColor, padding: '13px', borderRadius: '50%', fontSize: '20px', color: 'white' }}></i>
                            <div className="info">
                                <h5 className="mb-0" style={{ color: textColor }}>
                                    {text?.ourAddress || (currentLange === "Ar" ? "عنواننا" : "Our Address")}
                                </h5>
                                <p className="mb-0" style={{ color: textColor }}>
                                    {text?.address || (currentLange === "Ar" ? "المنيا الجديدة" : "Al menya elgededa")}
                                </p>
                            </div>
                        </div>

                        <div className="info-item d-flex align-items-center p-3 mb-3" style={{ backgroundColor: infoBackgroundColor }}>
                            <i className="fa-solid fa-envelope me-3" style={{ backgroundColor: iconBackgroundColor, padding: '13px', borderRadius: '50%', fontSize: '20px', color: 'white' }}></i>
                            <div className="info">
                                <h5 className="mb-0" style={{ color: textColor }}>
                                    {text?.emailUs || (currentLange === "Ar" ? "راسلنا عبر البريد الإلكتروني" : "Email Us")}
                                </h5>
                                <p className="mb-0" style={{ color: textColor }}>
                                    {text?.email || "tastyBites@gmail.com"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="col-md-6 mb-4">
                        <div className="info-item d-flex align-items-center p-3 mb-3" style={{ backgroundColor: infoBackgroundColor }}>
                            <i className="fa-solid fa-phone me-3" style={{ backgroundColor: iconBackgroundColor, padding: '13px', borderRadius: '50%', fontSize: '20px', color: 'white' }}></i>
                            <div className="info">
                                <h5 className="mb-0" style={{ color: textColor }}>
                                    {text?.callUs || (currentLange === "Ar" ? "اتصل بنا" : "Call Us")}
                                </h5>
                                <p className="mb-0" style={{ color: textColor }}>
                                    {text?.phone || "+20 010 123 4567"}
                                </p>
                            </div>
                        </div>

                        <div className="info-item d-flex align-items-center p-3 mb-3" style={{ backgroundColor: infoBackgroundColor }}>
                            <i className="fa-solid fa-share-nodes me-3" style={{ backgroundColor: iconBackgroundColor, padding: '13px', borderRadius: '50%', fontSize: '20px', color: 'white' }}></i>
                            <div className="info">
                                <h5 className="mb-0" style={{ color: textColor }}>
                                    {text?.openingHours || (currentLange === "Ar" ? "ساعات العمل" : "Opening Hours")}
                                </h5>
                                <p className="mb-0" style={{ color: textColor }}>
                                    {text?.hours || (currentLange === "Ar" ? "الإثنين-السبت: 11 صباحًا - 11 مساءً؛ الأحد: مغلق" : "Mon-Sat: 11AM - 23PM; Sunday: Closed")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
