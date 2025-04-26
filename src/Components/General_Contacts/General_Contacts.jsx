import React, { useContext } from 'react';
import './General_Contacts.css'; // Import the CSS file for styling
import { ThemeContext } from "../../Context/ThemeContext"; // استيراد ThemeContext

function Contact() {
    // الحصول على theme من context
    const { theme } = useContext(ThemeContext);

    // تحديد الألوان بناءً على الـ theme
    const backgroundColor = theme === "dark" ? "#151518" : "#f8f9fa"; // اللون الخلفي في الـ dark و الـ light mode
    const textColor = theme === "dark" ? "white" : "black"; // لون النصوص في الـ dark و الـ light mode
    const iconBackgroundColor = theme === "dark" ? "#ff6b6b" : "#ff5733"; // لون خلفية الأيقونات في الـ dark و الـ light mode
    const infoBackgroundColor = theme === "dark" ? "#26262D" : "#f1f1f1"; // لون الخلفية للمعلومات في الـ dark و الـ light mode

    return (
        <div className="contact pt-5" id="contact" style={{ backgroundColor: backgroundColor, color: textColor, padding: '50px 0' }}>
            <div className="container">
                {/* Heading Section */}
                <h2 className="text-center pb-3">
                    <span style={{ color: '#ff6b6b' }}>General</span> CONTACT
                </h2>
                <h3 className="text-center pb-4">
                    Need Help ? <span style={{ color: '#ff6b6b' }}>Contact Us</span>
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
                                <h5 className="mb-0" style={{ color: textColor }}>Our Address</h5>
                                <p className="mb-0" style={{ color: textColor }}>Al menya elgededa</p>
                            </div>
                        </div>

                        <div className="info-item d-flex align-items-center p-3 mb-3" style={{ backgroundColor: infoBackgroundColor }}>
                            <i className="fa-solid fa-envelope me-3" style={{ backgroundColor: iconBackgroundColor, padding: '13px', borderRadius: '50%', fontSize: '20px', color: 'white' }}></i>
                            <div className="info">
                                <h5 className="mb-0" style={{ color: textColor }}>Email Us</h5>
                                <p className="mb-0" style={{ color: textColor }}>tastyBites@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="col-md-6 mb-4">
                        <div className="info-item d-flex align-items-center p-3 mb-3" style={{ backgroundColor: infoBackgroundColor }}>
                            <i className="fa-solid fa-phone me-3" style={{ backgroundColor: iconBackgroundColor, padding: '13px', borderRadius: '50%', fontSize: '20px', color: 'white' }}></i>
                            <div className="info">
                                <h5 className="mb-0" style={{ color: textColor }}>Call Us</h5>
                                <p className="mb-0" style={{ color: textColor }}>+20 010 123 4567</p>
                            </div>
                        </div>

                        <div className="info-item d-flex align-items-center p-3 mb-3" style={{ backgroundColor: infoBackgroundColor }}>
                            <i className="fa-solid fa-share-nodes me-3" style={{ backgroundColor: iconBackgroundColor, padding: '13px', borderRadius: '50%', fontSize: '20px', color: 'white' }}></i>
                            <div className="info">
                                <h5 className="mb-0" style={{ color: textColor }}>Opening Hours</h5>
                                <p className="mb-0" style={{ color: textColor }}>Mon-Sat: 11AM - 23PM; Sunday : Closed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
