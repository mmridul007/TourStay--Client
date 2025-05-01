import React, { useState, useEffect } from "react";
import "./orderConfirmation.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";

const OrderConfirmation = ({
  roomData,
  dateRange,
  closeConfirmation,
  onPaymentSuccess,
  customerId,
  ownerId,
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

  const navigate = useNavigate();

  // Calculate total price
  const startDate = dateRange[0].startDate;
  const endDate = dateRange[0].endDate;
  const daysDifference =
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
  const originalPrice = daysDifference * roomData.cheapestPrice;
  const platformFee = 30; // Fixed platform fee 30 BDT
  const discountAmount = (originalPrice * discount) / 100;
  const totalPrice = originalPrice + platformFee - discountAmount;

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
        `https://tourstay-server.onrender.com/api/users/${customerId}`
      );
      if (response.data) {
        setCustomerInfo({
          name: response.data.fullName || "",
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
        WELCOME10: 10,
        SUMMER20: 20,
        WEEKEND15: 15,
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

  // Toggle edit mode for customer info
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Function to get all dates between start and end date
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];

    const currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate).toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
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
      // Prepare booking data
      const unavailableDates = getDatesInRange(startDate, endDate);
      const bookingData = {
        roomId: roomData._id,
        customerId: customerId || "guest",
        ownerId: ownerId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        checkIn: startDate,
        checkOut: endDate,
        totalNights: daysDifference,
        totalPrice: totalPrice,
        platformFee: platformFee,
        paymentMethod: "sslcommerz",
        isPromoApplied: isPromoApplied,
        promoCode: isPromoApplied ? promoCode : "",
        unavailableDates,
        address: roomData.address,
        city: roomData.city,
        bookingType: roomData.bookingType,
      };

      const payload = {
        booking: bookingData,
        total_amount: totalPrice,
        product_name: `Booking for ${roomData.title}`,
        product_category: "Hotel Booking",
        cus_name: customerInfo.name,
        cus_email: customerInfo.email,
        cus_phone: customerInfo.phone,
      };

      const response = await axios.post(
        `https://tourstay-server.onrender.com/api/payment/sslcommerz/init`,
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
        // Server responded with error status
        errorMessage =
          error.response.data?.message ||
          `Server error (${error.response.status})`;
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        // Request was made but no response
        errorMessage = "No response from server - check your connection";
        console.error("No response received:", error.request);
      } else {
        // Other errors
        errorMessage = error.message;
        console.error("Error:", error.message);
      }

      setPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="order-confirmation-overlay">
      <div className="order-confirmation-container">
        <button className="close-btn" onClick={closeConfirmation}>
          ×
        </button>

        <h2>Confirm Your Booking</h2>

        <div className="booking-summary">
          <h3>Booking Summary</h3>

          <div className="summary-details">
            <div className="summary-row">
              <span>Room:</span>
              <span>{roomData.title}</span>
            </div>

            <div className="summary-row">
              <span>Location:</span>
              <span>
                {roomData.address}, {roomData.city}
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
                {daysDifference} day{daysDifference > 1 ? "s" : ""}
              </span>
            </div>

            <div className="summary-row">
              <span>Guests:</span>
              <span>1 guest</span>
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
            />
            <button
              onClick={validatePromoCode}
              disabled={isProcessing || !promoCode}
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
              Room Rate (BDT {roomData.cheapestPrice} × {daysDifference} days)
            </span>
            <span>BDT {originalPrice}</span>
          </div>

          <div className="price-row platform-fee">
            <span>Platform Fee</span>
            <span>BDT {platformFee}</span>
          </div>

          {discount > 0 && (
            <div className="price-row discount">
              <span>Discount ({discount}%)</span>
              <span>-BDT {discountAmount}</span>
            </div>
          )}

          <div className="price-row total">
            <span>Total Amount</span>
            <span>BDT {totalPrice}</span>
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
            {isProcessing ? "Processing..." : "Confirm & Pay BDT " + totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
