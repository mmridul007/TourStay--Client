import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { showConfirmToast } from "../../components/confirmToast/ConfirmToast";

const HotelOrders = () => {
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hotelModalVisible, setHotelModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
  });
  const [currentReview, setCurrentReview] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  const showSuccessToast = (message) => toast.success(message);
  const showErrorToast = (message) => toast.error(message);

  // Show alert message
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Fetch orders for the logged-in user
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/hotel-payment/customer/${currentUser?._id}`
      );
      // Sort orders by date (newest first)
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      setError(err.message || "Error loading orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the hotel info when modal is opened
  const fetchHotelInfo = async (hotelId) => {
    // console.log(hotelId)
    setHotelLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/hotels/find/${hotelId._id}`
      );
      setHotelInfo(response.data);
    } catch (err) {
      console.error("Error fetching hotel info:", err);
    } finally {
      setHotelLoading(false);
    }
  };

  // Fetch reviews for a specific hotel by the current user
  const fetchReviewForHotelByUser = async (hotelId) => {
    setReviewsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/hotels/find/${hotelId._id}`
      );

      const hotelData = response.data;
      const userReview = hotelData.reviews.find(
        (review) => review.userId === currentUser?._id
      );

      if (userReview) {
        setCurrentReview(userReview);
        setReviewData({
          rating: userReview.rating,
          comment: userReview.comment,
        });
      } else {
        setCurrentReview(null);
        setReviewData({
          rating: 0,
          comment: "",
        });
      }
    } catch (err) {
      console.error("Error fetching review:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Navigate to hotel details page
  const handleViewHotel = (hotelId) => {
    navigate(`/hotels/${hotelId._id}`);
  };

  // Load orders on component mount
  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  // Check authentication status
  useEffect(() => {
    if (!currentUser) {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  }, [currentUser, navigate]);

  // Handle opening hotel details modal
  const handleOpenHotelModal = (order) => {
    if (!order) {
      console.error("No order provided to view hotel info");
      showAlert("Error loading order information", "error");
      return;
    }

    setSelectedOrder(order);
    fetchHotelInfo(order.hotelId);
    setHotelModalVisible(true);
  };

  // Handle opening review modal
  const handleOpenReviewModal = async (order) => {
    setSelectedOrder(order);

    // Fetch both review & full hotel data
    await fetchReviewForHotelByUser(order.hotelId);
    await fetchHotelInfo(order.hotelId); // <-- fetch hotelInfo here

    setReviewModalVisible(true);
  };

  // Close modals
  const handleCloseModals = () => {
    setHotelModalVisible(false);
    setReviewModalVisible(false);
    setSelectedOrder(null);
  };

  // Handle input changes in review form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!hotelInfo) {
      console.warn("hotelInfo is null - review can't be submitted");
      return;
    }

    const submitReview = async () => {
      try {
        let updatedReviews = [...hotelInfo.reviews];

        if (currentReview) {
          updatedReviews = updatedReviews.map((review) =>
            review.userId === currentUser._id
              ? {
                  ...review,
                  rating: reviewData.rating,
                  comment: reviewData.comment,
                  date: new Date(),
                }
              : review
          );
        } else {
          updatedReviews.push({
            userId: currentUser._id,
            rating: reviewData.rating,
            comment: reviewData.comment,
            date: new Date(),
          });
        }

        const totalRating = updatedReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const newRating =
          updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;

        await axios.put(`http://localhost:4000/api/hotels/${hotelInfo._id}`, {
          ...hotelInfo,
          reviews: updatedReviews,
          rating: parseFloat(newRating.toFixed(1)),
        });

        showSuccessToast(
          currentReview
            ? "Review updated successfully"
            : "Review submitted successfully"
        );

        fetchReviewForHotelByUser(selectedOrder.hotelId);
        setReviewModalVisible(false);
      } catch (err) {
        console.error("Error submitting review:", err);
        showErrorToast("Failed to save review. Please try again.");
      }
    };

    if (currentReview) {
      showConfirmToast({
        message: "Are you sure you want to update your review?",
        onConfirm: submitReview,
        onCancel: () => showErrorToast("Review update cancelled."),
      });
    } else {
      await submitReview();
    }
  };

  // Handle review deletion
  const handleDeleteReview = async () => {
    if (!currentReview || !hotelInfo) return;

    showConfirmToast({
      message: "Are you sure you want to delete your review?",
      onConfirm: async () => {
        try {
          const updatedReviews = hotelInfo.reviews.filter(
            (review) => review.userId !== currentUser._id
          );

          const totalRating = updatedReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const newRating =
            updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;

          await axios.put(`http://localhost:4000/api/hotels/${hotelInfo._id}`, {
            ...hotelInfo,
            reviews: updatedReviews,
            rating: parseFloat(newRating.toFixed(1)),
          });

          showSuccessToast("Review deleted successfully");

          fetchReviewForHotelByUser(selectedOrder.hotelId);
          setReviewModalVisible(false);
        } catch (err) {
          console.error("Error deleting review:", err);
          showErrorToast("Failed to delete review. Please try again.");
        }
      },
      onCancel: () => showErrorToast("Review deletion cancelled."),
    });
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    const orderToCancel = orders.find((order) => order._id === orderId);
    if (!orderToCancel) return;

    const checkInDate = new Date(orderToCancel.checkIn);
    const currentDate = new Date();

    if (checkInDate <= currentDate) {
      showErrorToast("Cannot cancel an order after check-in date.");
      return;
    }

    showConfirmToast({
      message: "Before cancel the order read our Cancel & Refund policy form the footer. Now are you sure you want to cancel this order?",
      onConfirm: async () => {
        try {
          await axios.put(
            `http://localhost:4000/api/hotel-payment/cancel/${orderId}`,
            {
              bookingStatus: "cancelled",
              paymentStatus:
                orderToCancel.paymentStatus === "completed"
                  ? "refund-initiated"
                  : "cancelled",
            }
          );

          showSuccessToast("Order cancelled successfully");
          await fetchOrders();
        } catch (err) {
          console.error("Error cancelling order:", err);
          showErrorToast("Failed to cancel order. Please try again.");
        }
      },
      onCancel: () => toast.info("Order cancellation aborted."),
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      <div className="orders-container">
        {alert.show && (
          <div className={`alert ${alert.type}`}>{alert.message}</div>
        )}

        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : error ? (
          <div className="error">Error loading orders. Please try again.</div>
        ) : orders?.length === 0 ? (
          <div className="no-orders">No orders found.</div>
        ) : (
          <>
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Price</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Transaction ID</th>
                    <th>Order Details</th>
                    <th>Review</th>
                    <th>View Hotel</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders?.map((order, index) => (
                    <tr key={order._id}>
                      <td>{indexOfFirstOrder + index + 1}</td>
                      <td>{formatDate(order.checkIn)}</td>
                      <td>{formatDate(order.checkOut)}</td>
                      <td>{order.totalPrice}tk</td>
                      <td>
                        <span className={`status-badge ${order.paymentStatus}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${order.bookingStatus}`}>
                          {order.bookingStatus}
                        </span>
                      </td>
                      <td>{order.transactionId}</td>
                      <td>
                        <button
                          className="owner-info-btn"
                          onClick={() => handleOpenHotelModal(order)}
                        >
                          View Details
                        </button>
                      </td>
                      <td>
                        <button
                          className="review-btn"
                          onClick={() => handleOpenReviewModal(order)}
                        >
                          Review
                        </button>
                      </td>
                      <td>
                        <button
                          className="view-room-btn"
                          onClick={() => handleViewHotel(order.hotelId)}
                        >
                          View Hotel
                        </button>
                      </td>
                      <td>
                        {order.bookingStatus !== "cancelled" &&
                          new Date(order.checkIn) > new Date() && (
                            <button
                              className="cancel-btn"
                              onClick={() => handleCancelOrder(order._id)}
                            >
                              Cancel Order
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-btn ${
                    currentPage === i + 1 ? "active-page" : ""
                  }`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hotel Details Modal */}
      {hotelModalVisible && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-modal" onClick={handleCloseModals}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {hotelLoading ? (
                <div className="loading">Loading hotel information...</div>
              ) : hotelInfo ? (
                <div className="owner-info">
                  <h3>{hotelInfo.name}</h3>

                  <p>
                    <strong>Room Type:</strong> {selectedOrder.roomType}
                  </p>
                  <p>
                    <strong>Room Numbers:</strong>{" "}
                    {selectedOrder.roomNumbers.join(", ")}
                  </p>
                  <p>
                    <strong>Number of Rooms:</strong>{" "}
                    {selectedOrder.numberOfRooms}
                  </p>
                  <p>
                    <strong>Total Nights:</strong> {selectedOrder.totalNights}
                  </p>
                  <p>
                    <strong>Adults:</strong> {selectedOrder.adults}
                  </p>
                  <p>
                    <strong>Children:</strong> {selectedOrder.children}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </p>

                  <h4>Hotel Contact Information</h4>
                  <p>
                    <strong>Email:</strong>{" "}
                    {hotelInfo.contact?.email || "Not provided"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {hotelInfo.contact?.phone || "Not provided"}
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    {hotelInfo.contact?.website || "Not provided"}
                  </p>
                  <p>
                    <strong>Address:</strong> {hotelInfo.address}
                  </p>

                  {selectedOrder.isPromoApplied && (
                    <p>
                      <strong>Promo Code Applied:</strong>{" "}
                      {selectedOrder.promoCode}
                    </p>
                  )}

                  {selectedOrder.bookingStatus === "cancelled" &&
                    selectedOrder.refundAmount > 0 && (
                      <div className="refund-info">
                        <p>
                          <strong>Refund Amount:</strong>{" "}
                          {selectedOrder.refundAmount}tk
                        </p>
                        <p>
                          <strong>Refund Status:</strong>{" "}
                          <span
                            className={`status-badge ${selectedOrder.refundStatus}`}
                          >
                            {selectedOrder.refundStatus}
                          </span>
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                <div className="error">Hotel information not available.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalVisible && selectedOrder && hotelInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{currentReview ? "Edit Review" : "Write a Review"}</h2>
              <button className="close-modal" onClick={handleCloseModals}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {reviewsLoading ? (
                <div className="loading">Loading review information...</div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="review-form">
                  <div className="rating-container">
                    <label>Rating:</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <label key={star} className="star-label">
                          <input
                            type="radio"
                            name="rating"
                            value={star}
                            checked={reviewData.rating === star}
                            onChange={handleInputChange}
                          />
                          <span
                            className={`star ${
                              reviewData.rating >= star ? "filled" : ""
                            }`}
                          >
                            ★
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment">Comment:</label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={reviewData.comment}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      {currentReview ? "Update Review" : "Submit Review"}
                    </button>

                    {currentReview && (
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={handleDeleteReview}
                      >
                        Delete Review
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelOrders;
