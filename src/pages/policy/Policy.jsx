import React from "react";
import "./policy.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const Policy = () => {
  return (
    <div>
      <Navbar />
      <div className="policy-container">
        <div className="policy-header">
          <h1 className="policy-title">
            TourStay Cancellation and Refund Policy
          </h1>
          <p className="last-updated">Last Updated: April 28, 2025</p>
        </div>

        <section className="policy-section">
          <h2 className="section-title">About TourStay</h2>
          <p className="section-text">
            TourStay is dedicated to providing exceptional hotel booking and
            room rental services exclusively in Bangladesh. We understand that
            plans can change, which is why we have established a clear
            cancellation and refund policy to ensure transparency and fairness
            for all our users.
          </p>
          <p className="section-text">
            Our platform connects travelers with the finest accommodations
            across Bangladesh, from luxurious hotels in Dhaka to beachside
            resorts in Cox's Bazar and mountain retreats in the Chittagong Hill
            Tracts. We strive to make your travel experience within Bangladesh
            seamless and memorable.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="section-title">Cancellation and Refund Policy</h2>
          <p className="section-text">
            At TourStay, we understand that circumstances can change. Our refund
            policy is designed to be fair to both our accommodation partners and
            our customers. The refund amount you receive depends on how far in
            advance you cancel your reservation before the check-in date.
          </p>

          <div className="table-container">
            <table className="policy-table">
              <thead>
                <tr>
                  <th>Cancellation Timing</th>
                  <th>Refund Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>On the check-in date</td>
                  <td>0% refund</td>
                </tr>
                <tr>
                  <td>1 day before check-in</td>
                  <td>20% refund</td>
                </tr>
                <tr>
                  <td>2-3 days before check-in</td>
                  <td>30% refund</td>
                </tr>
                <tr>
                  <td>3-6 days before check-in</td>
                  <td>50% refund</td>
                </tr>
                <tr>
                  <td>7+ days before check-in</td>
                  <td>100% refund</td>
                </tr>
                <td>
                  <span className="wearningStar">**</span> N.B. You can't get
                  back the platform fees.
                </td>
              </tbody>
            </table>
          </div>
        </section>

        <section className="policy-section">
          <h2 className="section-title">How to Request a Refund</h2>
          <p className="section-text">
            To cancel your booking and request a refund, please follow these
            steps:
          </p>
          <ol className="refund-steps">
            <li>Log in to your TourStay account</li>
            <li>Navigate to "Orders"</li>
            <li>Select the booking you wish to cancel</li>
            <li>Click on "Cancel Booking"</li>
            <li>Follow the prompts to complete the cancellation</li>
          </ol>
          <p className="section-text">
            The refund will be processed to your original payment method within
            7-10 business days.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="section-title">Special Circumstances</h2>
          <p className="section-text">
            In case of natural disasters, national emergencies, or other
            exceptional circumstances that may affect your booking, please
            contact our customer support team at tourstay@gmail.com for
            assistance. We may offer more flexible cancellation options in such
            situations.
          </p>
        </section>

        <footer className="policy-footer">
          <p>
            For any questions regarding our Cancellation and Refund Policy,
            please contact:
          </p>
          <p className="contact-info">
            Email: tourstay@gmail.com | Phone: +880 1719-877736
          </p>
        </footer>
      </div>
      <Footer/>
    </div>
  );
};

export default Policy;
