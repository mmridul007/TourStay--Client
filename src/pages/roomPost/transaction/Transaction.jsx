import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showConfirmToast } from "../../../components/confirmToast/ConfirmToast";
import "./transaction.css";

const Transaction = ({ id }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [withdrawalNumber, setWithdrawalNumber] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
  const [orderHistory, setOrderHistory] = useState([]);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [orderDetails, setOrderDetails] = useState({});

  const historyPerPage = 6;
  const ordersPerPage = 8;
  const platformFeePercentage = 7;
  const platformFeePerOrder = 30; // BDT subtracted from each order (hidden from user)

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://tourstay-server.onrender.com/api/users/${id}`
        );
        setUser(response.data);
        setWithdrawMethod(response.data.withdrawMethod || "");
        setWithdrawalNumber(response.data.withdrawalNumber || "");
        setLoading(false);
      } catch (err) {
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Fetch order history
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          `https://tourstay-server.onrender.com/api/payment/orderForOwner/${id}`
        );
        setOrderHistory(response.data);
      } catch (err) {
        console.error("Failed to load order history:", err);
        toast.error("Failed to load order history");
      }
    };

    if (user) {
      fetchOrderHistory();
    }
  }, [user, id]);

  // Fetch withdrawal history (from user data)
  useEffect(() => {
    if (user && user.withdrawHistory) {
      // Sort withdrawal history from newest to oldest
      const sortedHistory = [...user.withdrawHistory].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setWithdrawalHistory(sortedHistory);
    }
  }, [user]);

  // Get room title for each order
  useEffect(() => {
    const fetchRoomDetails = async () => {
      const details = {};

      for (const order of orderHistory) {
        if (!details[order.roomId]) {
          try {
            const response = await axios.get(
              `https://tourstay-server.onrender.com/api/quickrooms/find/${order.roomId}`
            );
            details[order.roomId] = response.data.title || "Unknown Room";
          } catch (err) {
            details[order.roomId] = "Unknown Room";
          }
        }
      }

      setOrderDetails(details);
    };

    if (orderHistory.length > 0) {
      fetchRoomDetails();
    }
  }, [orderHistory]);

  const handleSetupSubmit = async (e) => {
    e.preventDefault();

    // Confirmation before updating withdrawal method
    showConfirmToast({
      message: "Are you sure you want to update your withdrawal method?",
      onConfirm: async () => {
        try {
          await axios.put(
            `https://tourstay-server.onrender.com/api/users/${id}`,
            {
              withdrawMethod,
              withdrawalNumber,
            },
            {
              withCredentials: true,
            }
          );
          // Update local user state
          setUser({
            ...user,
            withdrawMethod,
            withdrawalNumber,
          });
          setShowSetupDialog(false);
          toast.success("Withdrawal method set up successfully!");
        } catch (err) {
          toast.error("Failed to set up withdrawal method");
        }
      },
      onCancel: () => {
        toast.info("Setup canceled");
      },
    });
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();

    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }

    if (withdrawAmount > user.balance) {
      toast.error("Withdrawal amount cannot exceed your available balance");
      return;
    }

    // Confirmation before processing withdrawal
    showConfirmToast({
      message: `Are you sure you want to withdraw ${withdrawAmount.toFixed(
        2
      )} BDT?`,
      onConfirm: async () => {
        try {
          // Calculate amount after platform fees
          const feeAmount = (withdrawAmount * platformFeePercentage) / 100;
          const netAmount = withdrawAmount - feeAmount;

          // Update user balance and withdrawal history
          const response = await axios.put(
            `https://tourstay-server.onrender.com/api/users/${id}`,
            {
              balance: user.balance - withdrawAmount,
              withdrawalStatus: "pending",
              withdrawalHoldAmount: netAmount,
              withdrawHistory: [
                ...user.withdrawHistory,
                { amount: netAmount, date: new Date() },
              ],
            },
            {
              withCredentials: true,
            }
          );

          setUser(response.data);
          // Add the new withdrawal to the beginning of the history array (newest first)
          setWithdrawalHistory([
            { amount: netAmount, date: new Date() },
            ...withdrawalHistory,
          ]);
          setShowWithdrawDialog(false);
          setWithdrawAmount(0);
          toast.success("Withdrawal request submitted successfully!");
        } catch (err) {
          toast.error("Failed to process withdrawal request");
        }
      },
      onCancel: () => {
        toast.info("Withdrawal canceled");
      },
    });
  };

  // Helper function to handle withdraw amount changes
  const handleWithdrawAmountChange = (value) => {
    const newValue = Math.max(0, Math.min(value, user?.balance || 0));
    setWithdrawAmount(newValue);
  };

  // Calculate available balance (visible to user)
  const availableBalance = user?.balance || 0;

  // Pagination for withdrawal history
  const indexOfLastHistory = currentHistoryPage * historyPerPage;
  const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
  const currentWithdrawalHistory = withdrawalHistory.slice(
    indexOfFirstHistory,
    indexOfLastHistory
  );
  const totalHistoryPages = Math.ceil(
    withdrawalHistory.length / historyPerPage
  );

  // Pagination for order history
  const indexOfLastOrder = currentOrderPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrderHistory = orderHistory.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalOrderPages = Math.ceil(orderHistory.length / ordersPerPage);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="transaction-container">
      <h2 className="title">Account Statements</h2>

      {/* Balance Information */}
      <div className="balance-section">
        <div className="balance-card">
          <h3>Available Balance</h3>
          <p className="balance-amount">{availableBalance.toFixed(2)} BDT</p>
        </div>
        <div className="balance-card">
          <h3>Total Withdrawn</h3>
          <p className="balance-amount">{user.totalWithdraw.toFixed(2)} BDT</p>
        </div>
        <div className="balance-card">
          <h3>Requested Amount</h3>
          <p className="balance-amount">
            {user.withdrawalHoldAmount.toFixed(2)} BDT
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="setup-btn" onClick={() => setShowSetupDialog(true)}>
          Set Up Withdrawal Method
        </button>
        <button
          className="withdraw-btn"
          onClick={() => setShowWithdrawDialog(true)}
          disabled={!user.withdrawMethod || availableBalance <= 0}
        >
          Withdraw Funds
        </button>
      </div>

      {/* Withdrawal History Section */}
      <div className="history-section">
        <div className="section-header">
          <h3>Withdrawal History</h3>
        </div>
        <div className="history-preview">
          {withdrawalHistory.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentWithdrawalHistory.map((withdrawal, index) => (
                      <tr key={index}>
                        <td>{withdrawal.amount.toFixed(2)} BDT</td>
                        <td>{formatDate(withdrawal.date)}</td>
                        <td>
                          <span
                            className={`status ${
                              user.withdrawalStatus || "completed"
                            }`}
                          >
                            {user.withdrawalStatus || "completed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Withdrawal History Pagination */}
              {totalHistoryPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() =>
                      setCurrentHistoryPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentHistoryPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    {currentHistoryPage} of {totalHistoryPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentHistoryPage((prev) =>
                        Math.min(prev + 1, totalHistoryPages)
                      )
                    }
                    disabled={currentHistoryPage === totalHistoryPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="no-data">No withdrawal history available</p>
          )}
        </div>
      </div>

      {/* Room Orders History Section */}
      <div className="history-section">
        <div className="section-header">
          <h3>Room Orders History</h3>
        </div>
        <div className="orders-container">
          {currentOrderHistory.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>S.L</th>
                      <th>Room Title</th>
                      <th>Price</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrderHistory.map((order, index) => (
                      <tr key={order._id}>
                        <td>{indexOfFirstOrder + index + 1}</td>
                        <td>{orderDetails[order.roomId] || "Loading..."}</td>
                        <td>{order.totalPrice} BDT</td>
                        <td>{formatDate(order.checkIn)}</td>
                        <td>{formatDate(order.checkOut)}</td>
                        <td>
                          <span className={`status ${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="info-btn"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCustomerDialog(true);
                            }}
                          >
                            Customer Info
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Orders Pagination */}
              {totalOrderPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() =>
                      setCurrentOrderPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentOrderPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    {currentOrderPage} of {totalOrderPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentOrderPage((prev) =>
                        Math.min(prev + 1, totalOrderPages)
                      )
                    }
                    disabled={currentOrderPage === totalOrderPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="no-data">No order history available</p>
          )}
        </div>
      </div>

      {/* Set Up Dialog */}
      {showSetupDialog && (
        <div className="ts-dialog-overlay">
          <div className="ts-dialog">
            <div className="ts-dialog-header">
              <h3>Set Up Withdrawal Method</h3>
            </div>
            <form onSubmit={handleSetupSubmit}>
              <div className="form-group">
                <label>Withdrawal Method</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  required
                >
                  <option value="">Select Method</option>
                  <option value="Bkash">Bkash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                </select>
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  value={withdrawalNumber}
                  onChange={(e) => setWithdrawalNumber(e.target.value)}
                  placeholder="Enter your account number"
                  required
                />
              </div>
              <div className="ts-dialog-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowSetupDialog(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Dialog */}
      {showWithdrawDialog && (
        <div className="ts-dialog-overlay">
          <div className="ts-dialog">
            <div className="ts-dialog-header">
              <h3>Withdraw Funds</h3>
            </div>
            <form onSubmit={handleWithdrawSubmit}>
              <div className="withdrawal-info">
                <div className="info-row">
                  <span>Available Balance:</span>
                  <span>{availableBalance.toFixed(2)} BDT</span>
                </div>
                <div className="info-row">
                  <span>Platform Fee ({platformFeePercentage}%):</span>
                  <span>
                    {((withdrawAmount * platformFeePercentage) / 100).toFixed(
                      2
                    )}{" "}
                    BDT
                  </span>
                </div>
                <div className="info-row highlight">
                  <span>You Will Receive:</span>
                  <span>
                    {(
                      withdrawAmount -
                      (withdrawAmount * platformFeePercentage) / 100
                    ).toFixed(2)}{" "}
                    BDT
                  </span>
                </div>
                <div className="info-row">
                  <span>Method:</span>
                  <span>{user.withdrawMethod}</span>
                </div>
                <div className="info-row">
                  <span>Account:</span>
                  <span>{user.withdrawalNumber}</span>
                </div>
              </div>
              <div className="form-group">
                <label>Withdrawal Amount</label>
                <div className="amount-input-container">
                  <button
                    type="button"
                    className="amount-btn"
                    onClick={() =>
                      handleWithdrawAmountChange(withdrawAmount - 100)
                    }
                    disabled={withdrawAmount <= 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) =>
                      handleWithdrawAmountChange(
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Enter amount to withdraw"
                    min="0"
                    max={availableBalance}
                    required
                    className="amount-input"
                  />
                  <button
                    type="button"
                    className="amount-btn"
                    onClick={() =>
                      handleWithdrawAmountChange(withdrawAmount + 100)
                    }
                    disabled={withdrawAmount >= availableBalance}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="ts-dialog-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowWithdrawDialog(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={
                    withdrawAmount <= 0 || withdrawAmount > availableBalance
                  }
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Info Dialog */}
      {showCustomerDialog && selectedOrder && (
        <div className="ts-dialog-overlay">
          <div className="ts-dialog">
            <div className="ts-dialog-header">
              <h3>Customer Information</h3>
              <button
                className="ts-close-btn"
                onClick={() => setShowCustomerDialog(false)}
              >
                x
              </button>
            </div>
            <div className="customer-info">
              <div className="info-row">
                <span>Name:</span>
                <span>{selectedOrder.customerName}</span>
              </div>
              <div className="info-row">
                <span>Email:</span>
                <span>{selectedOrder.customerEmail}</span>
              </div>
              <div className="info-row">
                <span>Phone:</span>
                <span>{selectedOrder.customerPhone}</span>
              </div>
              <div className="info-row">
                <span>Total Nights:</span>
                <span>{selectedOrder.totalNights}</span>
              </div>
              <div className="info-row">
                <span>Payment Method:</span>
                <span>{selectedOrder.paymentMethod}</span>
              </div>
              <div className="info-row">
                <span>Transaction ID:</span>
                <span>{selectedOrder.transactionId}</span>
              </div>
              <div className="info-row">
                <span>Payment Status:</span>
                <span className={`status ${selectedOrder.paymentStatus}`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
              <div className="info-row">
                <span>Booking Status:</span>
                <span className={`status ${selectedOrder.status}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default Transaction;
