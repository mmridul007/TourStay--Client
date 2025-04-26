import React, { useState, useEffect } from "react";
import "./hotelConfirmation.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HotelConfirmation = ({
  hotelData,
  roomData,
  roomNumbers,
  dateRange,
  closeConfirmation,
  onPaymentSuccess,
  customerId,
  totalAmount,
  adults,
  childrens,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [paymentType, setPaymentType] = useState("full"); // 'full' or 'advance'
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(totalAmount);

  const navigate = useNavigate();

  // Calculate dates and amounts
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  const daysDifference =
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;

  // Calculate advance payment (10% non-refundable)
  useEffect(() => {
    const calculatedAdvance = Math.round(totalAmount * 0.1);
    setAdvanceAmount(calculatedAdvance);

    if (paymentType === "advance") {
      setIsPromoApplied(false);
      setPromoCode("");
      setPromoMessage("Promo codes are not applicable with advance payment.");
      setDiscount(0);
      setIsPromoValid(false);
      setFinalAmount(calculatedAdvance);
    } else {
      const discountedTotal = Math.round(totalAmount * (1 - discount / 100));
      setFinalAmount(discountedTotal);
    }
  }, [paymentType, totalAmount, discount]);

  // Fetch user data on component mount if customerId exists
  useEffect(() => {
    if (customerId && customerId !== "guest") {
      fetchUserData();
    }
  }, [customerId]);

  // Fetch user data from backend
  const fetchUserData = async () => {
    setIsLoadingUserData(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/${customerId}`
      );
      if (response.data) {
        setCustomerInfo({
          name: response.data.username || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // Format dates for display
  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Validate promo code
  const validatePromoCode = () => {
    setIsProcessing(true);
    // In real implementation, you would check this against your database
    setTimeout(() => {
      // Example promo codes
      const validPromoCodes = {
        HOTEL10: 10,
        STAY20: 20,
        WELCOME15: 15,
      };

      if (validPromoCodes[promoCode]) {
        setDiscount(validPromoCodes[promoCode]);
        setIsPromoValid(true);
        setIsPromoApplied(true);
        setPromoMessage(`${validPromoCodes[promoCode]}% discount applied!`);
      } else {
        setDiscount(0);
        setIsPromoValid(false);
        setIsPromoApplied(false);
        setPromoMessage("Invalid promo code");
      }
      setIsProcessing(false);
    }, 500);
  };

  // Handle input changes for customer info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //  console.log(roomNumbers)
  // Toggle edit mode for customer info
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    // Validate required fields
    if (!customerInfo.name || !customerInfo.phone) {
      setPaymentError("Please fill all required fields");
      return;
    }

    setIsProcessing(true);
    setPaymentError("");

    try {
      // Prepare booking data for hotel
      const bookingData = {
        hotelId: hotelData._id,
        customerId: customerId || "guest",
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        checkIn: startDate,
        checkOut: endDate,
        totalNights: daysDifference,
        totalPrice: totalAmount,
        roomType: roomData[0]?.title || "Standard", // Assuming first room's title
        numberOfRooms: roomData.length,
        roomNumbers: roomNumbers,
        adults: adults || 1, // Default, can be dynamic
        children: childrens || 0, // Default, can be dynamic
        paymentMethod: "sslcommerz",
        isPromoApplied: isPromoApplied,
        promoCode: isPromoApplied ? promoCode : "",
        paymentType: paymentType,
        amountPaid: finalAmount,
        bookingType: "Hotel",
      };

      const payload = {
        bookingData,
        total_amount: finalAmount,
        product_name: `Booking at ${hotelData.name}`,
        product_category: "Hotel Booking",
        cus_name: customerInfo.name,
        cus_email: customerInfo.email,
        cus_phone: customerInfo.phone,
      };

      const response = await axios.post(
        `http://localhost:4000/api/hotel-payment/init`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data.status === "SUCCESS") {
        window.location.href = response.data.GatewayPageURL;
      } else {
        throw new Error(response.data.message || "Payment failed");
      }
    } catch (error) {
      let errorMessage = "Payment initialization failed";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = "No response from server - check your connection";
      } else {
        errorMessage = error.message;
      }

      setPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="hotel-confirmation-overlay">
      <div className="hotel-confirmation-container">
        <button className="close-btn" onClick={closeConfirmation}>
          ×
        </button>

        <h2>Confirm Your Hotel Booking</h2>

        <div className="booking-summary">
          <h3>Booking Summary</h3>

          <div className="summary-details">
            <div className="summary-row">
              <span>Hotel:</span>
              <span>{hotelData.name}</span>
            </div>

            <div className="summary-row">
              <span>Location:</span>
              <span>
                {hotelData.address}, {hotelData.city}
              </span>
            </div>

            <div className="summary-row">
              <span>Check In:</span>
              <span>{formatDate(startDate)}</span>
            </div>

            <div className="summary-row">
              <span>Check Out:</span>
              <span>{formatDate(endDate)}</span>
            </div>

            <div className="summary-row">
              <span>Duration:</span>
              <span>
                {daysDifference} night{daysDifference > 1 ? "s" : ""}
              </span>
            </div>

            <div className="summary-row">
              <span>Rooms:</span>
              <span>
                {roomData.length} {roomData.length === 1 ? "room" : "rooms"}
              </span>
            </div>

            <div className="summary-row">
              <span>Room Type:</span>
              <span>{roomData[0]?.title || "Standard"}</span>
            </div>
          </div>
        </div>

        <div className="customer-info">
          <div className="info-header">
            <h3>Your Information</h3>
            {customerId && customerId !== "guest" && (
              <button
                className="edit-info-btn"
                onClick={toggleEditMode}
                disabled={isLoadingUserData}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            )}
          </div>

          {isLoadingUserData ? (
            <div className="loading-indicator">Loading your information...</div>
          ) : (
            <div className="info-inputs">
              <div className="input-group">
                <label>Name*</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                  disabled={!isEditing && customerId && customerId !== "guest"}
                />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                  disabled={!isEditing && customerId && customerId !== "guest"}
                />
              </div>
              <div className="input-group">
                <label>Phone*</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                  required
                  disabled={!isEditing && customerId && customerId !== "guest"}
                />
              </div>
            </div>
          )}
        </div>

        <div className="promo-section">
          <h3>Have a Promo Code?</h3>
          <div className="promo-input">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={paymentType === "advance"}
            />
            <button
              onClick={validatePromoCode}
              disabled={isProcessing || !promoCode || paymentType === "advance"}
            >
              Apply
            </button>
          </div>
          {promoMessage && (
            <p className={isPromoValid ? "promo-success" : "promo-error"}>
              {promoMessage}
            </p>
          )}
        </div>

        <div className="price-breakdown">
          <h3>Price Details</h3>

          <div className="price-row">
            <span>
              {roomData.length} {roomData.length === 1 ? "Room" : "Rooms"} ×{" "}
              {daysDifference} night{daysDifference > 1 ? "s" : ""}
            </span>
            <span>BDT {totalAmount}</span>
          </div>

          {discount > 0 && (
            <div className="price-row discount">
              <span>Discount ({discount}%)</span>
              <span>-BDT {Math.round((totalAmount * discount) / 100)}</span>
            </div>
          )}

          <div className="price-row total">
            <span>Total Amount</span>
            <span>
              BDT {totalAmount - Math.round((totalAmount * discount) / 100)}
            </span>
          </div>
        </div>

        <div className="payment-options-section">
          <h3>Payment Options</h3>

          <div className="payment-type-selector">
            <label
              className={`payment-option ${
                paymentType === "full" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="full"
                checked={paymentType === "full"}
                onChange={() => setPaymentType("full")}
              />
              <div className="option-content">
                <span className="option-title">Full Payment</span>
                <span className="option-description">
                  Pay the full amount now
                </span>
              </div>
            </label>

            <label
              className={`payment-option ${
                paymentType === "advance" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="advance"
                checked={paymentType === "advance"}
                onChange={() => setPaymentType("advance")}
              />
              <div className="option-content">
                <span className="option-title">Advance Payment (10%)</span>
                <span className="option-description">
                  Pay BDT {advanceAmount} now (non-refundable), remaining at
                  check-in
                </span>
              </div>
            </label>
          </div>

          <div className="final-amount">
            <span>Amount to Pay Now:</span>
            <span className="amount">BDT {finalAmount}</span>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Payment Method</h3>
          <div className="payment-options">
            <div className="payment-option selected">
              <div className="payment-logo">
                <span className="payment-name">SSLCommerz</span>
              </div>
            </div>
          </div>
          {paymentError && <p className="payment-error">{paymentError}</p>}
        </div>

        <div className="confirmation-actions">
          <button
            className="cancel-btn"
            onClick={closeConfirmation}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            className="confirm-btn"
            disabled={isProcessing}
            onClick={handlePaymentSubmit}
          >
            {isProcessing ? "Processing..." : `Pay Now BDT ${finalAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelConfirmation;
