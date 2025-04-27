import React from "react";
import "./contactUs.css";
import Navbar from "../../components/navbar/Navbar";

const ContactUs = () => {
  return (
    <div>
        <Navbar/>
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p className="subtitle">
            We're here to help you with your hotel booking needs in Bangladesh
          </p>
        </div>

        <section className="about-section">
          <h2>About TourStay</h2>
          <p>
            TourStay is Bangladesh's premier hotel booking platform, connecting
            travelers with the finest accommodations across the country. From
            luxury hotels in Dhaka to beachside resorts in Cox's Bazar and
            charming stays in Sylhet, we make finding and booking the perfect
            accommodation simple and secure.
          </p>
          <p>
            With our QuickHotel system, guests can instantly book verified
            properties with confidence, while hotel owners benefit from our
            streamlined management tools. Our dedicated support team is
            available to assist both travelers and property partners.
          </p>
        </section>

        <div className="contact-grid">
          <section className="contact-card">
            <div className="card-header">
              <i className="icon hotel-icon"></i>
              <h2>Hotel Registration</h2>
            </div>
            <p>
              Want to list your hotel or property on TourStay? Our team will
              help you get set up with our platform and maximize your bookings
              potential.
            </p>
            <div className="contact-info">
              <div className="info-item">
                <span className="label">Email:</span>
                <a href="mailto:tourstay@gmail.com">tourstay@gmail.com</a>
              </div>
              <div className="info-item">
                <span className="label">Urgent Contact:</span>
                <a href="mailto:mmridul116@gmail.com">mmridul116@gmail.com</a>
              </div>
              <div className="info-item">
                <span className="label">Phone:</span>
                <a href="tel:+8801719877736">+880 171-987-7736</a>
              </div>
            </div>
          </section>

          <section className="contact-card">
            <div className="card-header">
              <i className="icon support-icon"></i>
              <h2>QuickHotel Support</h2>
            </div>
            <p>
              Experiencing issues with your booking? Need to report concerns
              about a property? Our customer support team is ready to assist you
              with any questions or issues.
            </p>
            <div className="contact-info">
              <div className="info-item">
                <span className="label">Email:</span>
                <a href="mailto:tourstay@gmail.com">tourstay@gmail.com</a>
              </div>
              <div className="info-item">
                <span className="label">Urgent Contact:</span>
                <a href="mailto:mmridul116@gmail.com">mmridul116@gmail.com</a>
              </div>
              <div className="info-item">
                <span className="label">Phone:</span>
                <a href="tel:+8801719877736">+880 171-987-7736</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
