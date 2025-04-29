import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import "./footer.css";

const Footer = () => {
  const [hoverIcon, setHoverIcon] = useState(null);

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Logo and Information Section */}
        <div className="footer-company">
          <div className="footer-logo">
            <img
              src="https://res.cloudinary.com/dkkdfz2n0/image/upload/v1739601631/Screenshot_2025-02-15_at_12.35.55_PM_opxr4x.png"
              alt="Company Logo"
            />
          </div>
          <div className="footer-description">
            <p>
              Your premier destination for comfortable and affordable
              accommodations nationwide.
            </p>

            <p className="copyright">© 2025 Tour Stay. All rights reserved.</p>
          </div>
        </div>

        {/* Information and Social Media Links Section */}
        <div className="footer-links">
          {/* Contact Info */}
          <div className="footer-section contact-section">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="contact-icon"
                />
                <span>DSC, Ashulia, Dhaka, Bangladesh</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                <a href="mailto:info@tourstay.com">tourstay@gmail.com</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                <a href="tel:+8801719877736">+8801719877736</a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="footer-section social-section">
            <h3>Connect With Us</h3>
            <div className="social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoverIcon("facebook")}
                onMouseLeave={() => setHoverIcon(null)}
                className={hoverIcon === "facebook" ? "icon-hover" : ""}
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoverIcon("twitter")}
                onMouseLeave={() => setHoverIcon(null)}
                className={hoverIcon === "twitter" ? "icon-hover" : ""}
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoverIcon("instagram")}
                onMouseLeave={() => setHoverIcon(null)}
                className={hoverIcon === "instagram" ? "icon-hover" : ""}
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoverIcon("linkedin")}
                onMouseLeave={() => setHoverIcon(null)}
                className={hoverIcon === "linkedin" ? "icon-hover" : ""}
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoverIcon("youtube")}
                onMouseLeave={() => setHoverIcon(null)}
                className={hoverIcon === "youtube" ? "icon-hover" : ""}
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>

            <button
              className="refund-policy-btn"
              onClick={() => (window.location.href = "/policy")}
            >
              Cancel & Refund Policy{" "}
              <FontAwesomeIcon icon={faArrowRight} className="btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
