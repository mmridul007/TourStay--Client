
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  // const { type } = useParams(); // e.g. "hotel", "flight"
  const tran_id = searchParams.get("tran_id");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Construct dynamic API endpoint
        const endpoint = `http://localhost:4000/api/payment/verify/${tran_id}`;

        const response = await axios.get(endpoint);

        if (response.data.status !== "completed") {
          window.location.href = `/payment-failed?reason=${encodeURIComponent(
            "Payment verification failed"
          )}`;
          return;
        }

        setBooking(response.data.booking);
      } catch (error) {
        console.error("Payment verification error:", error);
        window.location.href = `/payment-failed?reason=${encodeURIComponent(
          "Server error"
        )}`;
      }
    };

    if ( !tran_id) {
      window.location.href = "/payment-failed?reason=missing_info";
    } else {
      verifyPayment();
    }
  }, [ tran_id]);

  return (
    <div className="payment-success">
      <h1>Payment Successful!</h1>
      {booking ? (
        <>
          <p>Transaction ID: {booking.transactionId}</p>
          <div className="booking-details">
            {/* <p>Hotel ID: {booking.hotelId}</p> */}
            <p>Check-in: {booking.checkIn}</p>
            <p>Check-out: {booking.checkOut}</p>
            <p>Total Paid: BDT {booking.totalPrice}</p>
          </div>
        </>
      ) : (
        <p>Loading booking details...</p>
      )}
      <button onClick={() => (window.location.href = "/")}>
        Return to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
