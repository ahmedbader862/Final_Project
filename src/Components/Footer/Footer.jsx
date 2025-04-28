import React, { useContext } from "react";
import "./Footer.css";
import QRCode from 'react-qr-code';
import { ThemeContext } from "../../Context/ThemeContext";
import { useSelector } from "react-redux";

function Footer() {
    const { theme } = useContext(ThemeContext);
    const currentLange = useSelector((state) => state.lange?.langue || "En");
    const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

    const backgroundColor = theme === "dark" ? "#151518" : "#f8f9fa";
    const textColor = theme === "dark" ? "white" : "black";
    const iconColor = theme === "dark" ? "#ff6b6b" : "#ff5733";
    const linkColor = theme === "dark" ? "text-white" : "text-dark";

    const qrCodeUrl = "https://drive.google.com/file/d/14tz-OEZjVpH6hk4fBBl7ZZ1AGk8KnxVu/view?usp=sharing";

    return (
        <footer
            className={`footer py-5`}
            style={{ backgroundColor: backgroundColor, color: textColor }}
            dir={currentLange === "Ar" ? "rtl" : "ltr"}
        >
            <div className="container">
                <div className="row">
                    {/* Column 1: Logo and Description */}
                    <div className="col-md-4 mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <h2 className={`text-uppercase mb-0`} style={{ color: textColor }}>
                                {text?.restaurantTitle || (currentLange === "Ar" ? "المطعم" : "Restaurant")}
                            </h2>
                        </div>
                        <p className={`mb-3`} style={{ color: textColor }}>
                            {text?.tastyBitesDesc || (currentLange === "Ar" ? "تيستي بايتس هي صفحة هبوط لمطعم تقدم تجربة طعام لذيذة لعملائها." : "TastyBites is a restaurant landing page that offers a delicious dining experience to its customers.")}
                        </p>
                        <h4 className={`text-uppercase mb-3`} style={{ color: textColor }}>
                            {text?.socialMedia || (currentLange === "Ar" ? "وسائل التواصل الاجتماعي" : "Social Media")}
                        </h4>
                        <ul className="list-inline social-list">
                            {["twitter", "facebook", "instagram", "linkedin"].map((platform) => (
                                <li key={platform} className="list-inline-item">
                                    <a href="#" style={{ color: textColor }}>
                                        <i className={`fab fa-${platform} fa-lg`} style={{ color: iconColor }}></i>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Newsletter and Quick Links */}
                    <div className="col-md-4 mb-4">
                        <h3 className={`text-uppercase mb-3`} style={{ color: textColor }}>
                            {text?.subscribeNewsletter || (currentLange === "Ar" ? "اشترك في نشرتنا الإخبارية" : "Subscribe Our Newsletter")}
                        </h3>
                        <p className={`mb-3`} style={{ color: textColor }}>
                            {text?.newsletterDesc || (currentLange === "Ar" ? "لا تفوت آخر تحديثات قائمتنا وعروضنا الحصرية - اشترك في نشرتنا الإخبارية اليوم وابقَ على اطلاع بكل ما يتعلق بميليفاي!" : "Don't miss out on our latest menu updates and exclusive offers - join our newsletter today and stay up-to-date with all things Mealify!")}
                        </p>
                        <div className="input-group mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder={text?.emailPlaceholder || (currentLange === "Ar" ? "أدخل عنوان بريدك الإلكتروني" : "Enter your email address")}
                            />
                            <button className="btn btn-danger" type="button">
                                {text?.subscribeButton || (currentLange === "Ar" ? "اشترك" : "Subscribe")}
                            </button>
                        </div>
                        <h4 className={`text-uppercase mb-3`} style={{ color: textColor }}>
                            {text?.quickLinks || (currentLange === "Ar" ? "روابط سريعة" : "Quick Links")}
                        </h4>
                        <div className="row">
                            <div className="col-6">
                                <ul className="list-unstyled">
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>
                                            {text?.aboutUs || ( sui === "Ar" ? "نبذة عنا" : "About Us")}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>
                                            {text?.contact || (currentLange === "Ar" ? "اتصل بنا" : "Contact")}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>
                                            {text?.testimonial || (currentLange === "Ar" ? "شهادات" : "Testimonial")}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-6">
                                <ul className="list-unstyled">
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>
                                            {text?.ourPartners || (currentLange === "Ar" ? "شركاؤنا" : "Our Partners")}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>
                                            {text?.faq || (currentLange === "Ar" ? "الأسئلة الشائعة" : "FAQ")}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" style={{ color: textColor }} className="text-decoration-none">
                                            <i className="fas fa-share me-2" style={{ color: iconColor }}></i>
                                            {text?.privacyPolicy || (currentLange === "Ar" ? "سياسة الخصوصية" : "Privacy Policy")}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Contact Information with QR Code */}
                    <div className="col-md-4 mb-4">
                        <h2 className={`text-uppercase mb-3`} style={{ color: textColor }}>
                            {text?.getInTouch || (currentLange === "Ar" ? "تواصل معنا" : "Get in Touch")}
                        </h2>
                        <ul className="list-unstyled mb-4">
                            <li className="mb-3">
                                <i className="fas fa-map-marker-alt me-2" style={{ color: iconColor }}></i>
                                <span style={{ color: textColor }}>
                                    {text?.address || (currentLange === "Ar" ? "شارع آدم 108، نيويورك، NY 535022" : "A108 Adam Street, New York, NY 535022")}
                                </span>
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-envelope me-2" style={{ color: iconColor }}></i>
                                <span style={{ color: textColor }}>
                                    {text?.email || "contact@example.com"}
                                </span>
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-phone me-2" style={{ color: iconColor }}></i>
                                <span style={{ color: textColor }}>
                                    {text?.phone || "+1 5589 55488 55"}
                                </span>
                            </li>
                            <div className="qr-code-section">
                                <p className="small" style={{ color: textColor }}>
                                    {text?.qrCodeDesc || (currentLange === "Ar" ? "امسح أو انقر للحصول على القائمة" : "Scan or click for menu")}
                                </p>
                                <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <div className="qr-code-wrapper">
                                        <QRCode
                                            value={qrCodeUrl}
                                            size={120}
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
