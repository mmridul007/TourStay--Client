import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./orders.css";
import { AuthContext } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { showConfirmToast } from "../../components/confirmToast/ConfirmToast";

const QuickStayOrders = () => {
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ownerModalVisible, setOwnerModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [ownerLoading, setOwnerLoading] = useState(false);
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
        `https://tourstay-server.onrender.com/api/payment/orderFor/${currentUser?._id}`
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

  // Fetch the owner info when modal is opened
  const fetchOwnerInfo = async (ownerId) => {
    setOwnerLoading(true);
    try {
      const response = await axios.get(
        `https://tourstay-server.onrender.com/api/users/${ownerId}`
      );
      setOwnerInfo(response.data);
    } catch (err) {
      console.error("Error fetching owner info:", err);
    } finally {
      setOwnerLoading(false);
    }
  };

  // Fetch reviews for a specific room by the current user
  const fetchReviewForRoomByUser = async (roomId) => {
    setReviewsLoading(true);
    try {
      const response = await axios.get(
        `https://tourstay-server.onrender.com/api/roomReview/findForUserAndRoom/${currentUser?._id}/${roomId}`
      );
      const review = response.data;

      if (review) {
        setCurrentReview(review);
        setReviewData({
          rating: review.rating,
          comment: review.comment,
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

  // Navigate to room details page
  const handleViewRoom = (roomId) => {
    navigate(`/quickrooms/${roomId}`);
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

  // Handle opening owner modal
  const handleOpenOwnerModal = (order) => {
    if (!order) {
      console.error("No order provided to view owner info");
      showAlert("Error loading order information", "error");
      return;
    }

    setSelectedOrder(order);
    fetchOwnerInfo(order.ownerId);
    setOwnerModalVisible(true);
  };

  // Handle opening review modal
  const handleOpenReviewModal = (order) => {
    setSelectedOrder(order);
    fetchReviewForRoomByUser(order.roomId);
    setReviewModalVisible(true);
  };

  // Close modals
  const handleCloseModals = () => {
    setOwnerModalVisible(false);
    setReviewModalVisible(false);
    setSelectedOrder(null);
  };

  // Handle input changes in review form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]: name === "rating" ? parseInt(value) : value,
    });
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (currentReview) {
      showConfirmToast({
        message: "Do you want to update your review?",
        onConfirm: async () => {
          try {
            await axios.put(
              `https://tourstay-server.onrender.com/api/roomReview/${currentReview._id}`,
              {
                rating: reviewData.rating,
                comment: reviewData.comment,
              }
            );
            toast.success("Review updated successfully");
            fetchReviewForRoomByUser(selectedOrder.roomId);
            setReviewModalVisible(false);
          } catch (err) {
            console.error("Error submitting review:", err);
            toast.error("Failed to save review. Please try again.");
          }
        },
        onCancel: () => {
          toast.info("Update canceled.");
        },
      });
    } else {
      // No current review, directly create a new one
      try {
        await axios.post(
          "https://tourstay-server.onrender.com/api/roomReview",
          {
            roomId: selectedOrder.roomId,
            userId: currentUser._id,
            rating: reviewData.rating,
            comment: reviewData.comment,
          }
        );
        toast.success("Review submitted successfully");
        fetchReviewForRoomByUser(selectedOrder.roomId);
        setReviewModalVisible(false);
      } catch (err) {
        console.error("Error submitting review:", err);
        toast.error("Failed to save review. Please try again.");
      }
    }
  };

  // Handle review deletion
  const handleDeleteReview = async () => {
    if (!currentReview) return;

    showConfirmToast({
      message: "Are you sure you want to delete this item?",
      onConfirm: async () => {
        try {
          await axios.delete(
            `https://tourstay-server.onrender.com/api/roomReview/${currentReview._id}`
          );
          toast.success("Review deleted successfully");
          fetchReviewForRoomByUser(selectedOrder.roomId);
          setReviewModalVisible(false);
        } catch (err) {
          console.error("Error deleting review:", err);
          toast.error("Failed to delete review. Please try again.");
        }
      },
      onCancel: () => {
        toast.info("Action canceled.");
      },
    });
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    const orderToCancel = orders.find((order) => order._id === orderId);

    // Cannot cancel if check-in date has passed
    const currentDate = new Date();
    const checkInDate = new Date(orderToCancel.checkIn);

    if (checkInDate <= currentDate) {
      showAlert(
        "Cannot cancel an order after check-in date has started.",
        "error"
      );
      return;
    }

    showConfirmToast({
      message:
        "Before cancel the order read our Cancel & Refund policy form the footer. Now are you sure you want to cancel this order?",
      onConfirm: async () => {
        try {
          // Update order status to "cancelled"
          await axios.put(
            `https://tourstay-server.onrender.com/api/payment/cancelOrder/${orderId}`,
            { status: "cancelled" }
          );

          // Get the room data to update unavailable dates
          const roomResponse = await axios.get(
            `https://tourstay-server.onrender.com/api/quickrooms/find/${orderToCancel.roomId}`
          );
          const roomData = roomResponse.data;

          // Create date objects for check-in and check-out
          const checkIn = new Date(orderToCancel.checkIn);
          const checkOut = new Date(orderToCancel.checkOut);

          // Create an array of dates between check-in and check-out (inclusive)
          const datesToRemove = [];
          const tempDate = new Date(checkIn);
          while (tempDate <= checkOut) {
            datesToRemove.push(new Date(tempDate).toString());
            tempDate.setDate(tempDate.getDate() + 1);
          }

          // Filter out dates that need to be removed
          const updatedUnavailableDates = roomData.unavailableDates.filter(
            (dateStr) => {
              const dateToCheck = new Date(dateStr);
              return !datesToRemove.some((dateToRemove) => {
                const removalDate = new Date(dateToRemove);
                return (
                  dateToCheck.toDateString() === removalDate.toDateString()
                );
              });
            }
          );

          // Update the room with the new unavailable dates
          await axios.put(
            `https://tourstay-server.onrender.com/api/quickrooms/${orderToCancel.roomId}`,
            {
              ...roomData,
              unavailableDates: updatedUnavailableDates,
            }
          );

          toast.success("Order cancelled successfully");
          await fetchOrders(); // Refresh orders
        } catch (err) {
          console.error("Error cancelling order:", err);
          toast.error("Failed to cancel order. Please try again.", "error");
        }
      },
      onCancel: () => {
        toast.info("Order cancellation canceled.", "info");
      },
    });
  };

  // Check if owner contact is still valid (within 3 days of checkout)
  const isOwnerContactValid = (checkOutDate) => {
    const today = new Date();
    const checkOut = new Date(checkOutDate);

    // Normalize both dates to midnight (so time doesn't mess things up)
    today.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);

    // Calculate the expiry date (check-out date + 3 days)
    const expiryDate = new Date(checkOut);
    expiryDate.setDate(expiryDate.getDate() + 3);

    // If today is before or equal to expiryDate, info is valid
    return today <= expiryDate;
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
                    <th>Owner Info</th>
                    <th>Review</th>
                    <th>View Room</th>
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
                          {order.status === "cancelled" &&
                          order.paymentStatus === "refunded"
                            ? "refunded"
                            : order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.transactionId}</td>
                      <td>
                        <button
                          className="owner-info-btn"
                          onClick={() => handleOpenOwnerModal(order)}
                        >
                          View Info
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
                          onClick={() => handleViewRoom(order.roomId)}
                        >
                          View Room
                        </button>
                      </td>
                      <td>
                        {order.status !== "cancelled" &&
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

      {/* Owner Info Modal */}
      {ownerModalVisible && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Owner Information</h2>
              <button className="close-modal" onClick={handleCloseModals}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {ownerLoading ? (
                <div className="loading">Loading owner information...</div>
              ) : ownerInfo ? (
                <div className="owner-info">
                  {isOwnerContactValid(selectedOrder.checkOut) ? (
                    <>
                      {ownerInfo.img && (
                        <div className="owner-photo-container">
                          <img
                            src={ownerInfo.img}
                            alt="Owner"
                            className="owner-photo"
                          />
                        </div>
                      )}
                      <p>
                        <strong>Name:</strong> {ownerInfo.username}
                      </p>
                      <p>
                        <strong>Email:</strong> {ownerInfo.email}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {ownerInfo.phone || "Not provided"}
                      </p>
                      {ownerInfo.address && (
                        <p>
                          <strong>Address:</strong> {ownerInfo.address}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="expired-contact1"></p>
                  )}

                  <div className="contact-validity">
                    {isOwnerContactValid(selectedOrder.checkOut) ? (
                      <p className="valid-contact">
                        <span className="validity-icon">✓</span>
                        Contact information is visible until{" "}
                        {formatDate(
                          new Date(
                            new Date(selectedOrder.checkOut).setDate(
                              new Date(selectedOrder.checkOut).getDate() + 3
                            )
                          )
                        )}
                      </p>
                    ) : (
                      <p className="expired-contact">
                        <span className="validity-icon">⚠</span>
                        Contact information has expired (valid for 3 days after
                        check-out only)
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="error">Owner information not available.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalVisible && selectedOrder && (
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

export default QuickStayOrders;
