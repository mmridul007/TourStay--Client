import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./paymentSuccess.css"; // Using the same CSS file as before

const HotelPaymentSuccess = () => {
  const { id: tran_id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setLoading(true);
        const endpoint = `http://localhost:4000/api/hotel-payment/verify/${tran_id}`;
        const response = await axios.get(endpoint);

        if (response.data.status !== "completed") {
          window.location.href = `/payment-failed?reason=${encodeURIComponent(
            "Payment verification failed"
          )}`;
          return;
        }

        setBooking(response.data.booking);
        setLoading(false);
      } catch (error) {
        console.error("Payment verification error:", error);
        window.location.href = `/payment-failed?reason=${encodeURIComponent(
          "Server error"
        )}`;
      }
    };

    if (!tran_id) {
      window.location.href = "/payment-failed?reason=missing_info";
    } else {
      verifyPayment();
    }
  }, [tran_id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <div className="success-header">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" width="64" height="64">
              <circle cx="12" cy="12" r="11" fill="#4CAF50" />
              <path
                d="M9 12l2 2 4-4"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <h1>Hotel Booking Confirmed!</h1>
          <p className="confirmation-message">
            Your hotel reservation has been successfully processed
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Verifying your payment...</p>
          </div>
        ) : (
          booking && (
            <div className="booking-details-container">
              <div className="booking-summary">
                <div className="booking-info-row">
                  <span className="info-label">Transaction ID:</span>
                  <span className="info-value">{booking.transactionId}</span>
                </div>
                {booking.hotelName && (
                  <div className="booking-info-row">
                    <span className="info-label">Hotel:</span>
                    <span className="info-value">{booking.hotelName}</span>
                  </div>
                )}
                <div className="booking-info-row">
                  <span className="info-label">Check-in:</span>
                  <span className="info-value">
                    {formatDate(booking.checkIn)}
                  </span>
                </div>
                <div className="booking-info-row">
                  <span className="info-label">Check-out:</span>
                  <span className="info-value">
                    {formatDate(booking.checkOut)}
                  </span>
                </div>
                <div className="booking-info-row total-row">
                  <span className="info-label">Total Paid:</span>
                  <span className="info-value price">
                    BDT{" "}
                    {booking.totalPrice?.toLocaleString() || booking.totalPrice}
                  </span>
                </div>
              </div>

              {/* <div className="confirmation-message-box">
                <p>
                  A confirmation email with your booking details has been sent
                  to your registered email address.
                </p>
              </div> */}
            </div>
          )
        )}

        <div className="action-buttons">
          <button
            className="primary-button"
            onClick={() => (window.location.href = "/")}
          >
            Return to Home
          </button>
          <button className="secondary-button" onClick={() => window.print()}>
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelPaymentSuccess;
