import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import "./footer.css";

const Footer = () => {
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
              accommodations nationalwide.
            </p>
            <p>© 2025 Tour Stay. All rights reserved.</p>
          </div>
        </div>

        {/* Information and Social Media Links Section */}
        <div className="footer-links">
          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/hotels">Hotels</a>
              </li>
              <li>
                <a href="/quickrooms">Quick Stay</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li>
                <a href="/faq">FAQ</a>
              </li>
              <li>
                <a href="/terms">Terms & Conditions</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/help">Help Center</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>DSC, Ashulia,Dhaka , Bangladesh</li>
              <li>info@tourstay.com</li>
              <li>+8801719877736</li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
