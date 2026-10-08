import React from "react";
import "./contactUs.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const DEVELOPER = {
  name: "Md. Mostak Ahamed Mridul",
  photo:
    "https://res.cloudinary.com/dkkdfz2n0/image/upload/v1791095253/Custom-other-photo_hkmcpf.jpg",
  github: "https://github.com/mmridul007",
  facebook: "https://www.facebook.com/mostak.mridul.2025/",
  linkedin: "https://www.linkedin.com/in/md-mostak-ahamed-mridul-7669631b2/",
};

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.575.1.78-.25.78-.555 0-.275-.01-1-.015-1.96-3.2.695-3.875-1.54-3.875-1.54-.525-1.33-1.28-1.685-1.28-1.685-1.045-.715.08-.7.08-.7 1.155.08 1.765 1.185 1.765 1.185 1.03 1.76 2.7 1.25 3.36.955.105-.745.4-1.25.73-1.54-2.555-.29-5.24-1.28-5.24-5.69 0-1.255.45-2.285 1.185-3.09-.12-.29-.515-1.46.11-3.045 0 0 .965-.31 3.165 1.18a10.99 10.99 0 0 1 5.76 0c2.2-1.49 3.165-1.18 3.165-1.18.625 1.585.23 2.755.115 3.045.74.805 1.185 1.835 1.185 3.09 0 4.42-2.69 5.395-5.255 5.68.41.355.78 1.055.78 2.125 0 1.535-.015 2.77-.015 3.145 0 .31.205.67.79.555C20.215 21.385 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const ContactUs = () => {
  return (
    <div>
      <Navbar />
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

        <section className="developer-section">
          <h2 className="developer-heading">Meet the Developer</h2>
          <div className="developer-card">
            <img
              className="developer-photo"
              src={DEVELOPER.photo}
              alt={DEVELOPER.name}
              loading="lazy"
            />
            <div className="developer-details">
              <h3>{DEVELOPER.name}</h3>
              <p className="developer-role">Developer of TourStay</p>
              <p className="developer-bio">
                Hi, I'm {DEVELOPER.name.split(" ").slice(-2).join(" ")}, the
                developer behind TourStay. I designed and built this platform
                end to end, from the QuickHotel booking system to the tools
                hotel owners use to manage their properties. I'd love to hear
                your feedback or connect with you.
              </p>
              <div className="social-links">
                <a
                  href={DEVELOPER.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link github"
                  aria-label="GitHub profile"
                  title="GitHub"
                >
                  <GithubIcon />
                </a>
                <a
                  href={DEVELOPER.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link facebook"
                  aria-label="Facebook profile"
                  title="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href={DEVELOPER.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link linkedin"
                  aria-label="LinkedIn profile"
                  title="LinkedIn"
                >
                  <LinkedinIcon />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;