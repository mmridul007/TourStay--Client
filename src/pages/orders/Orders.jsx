import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import HotelOrders from "./HotelOrders";
import QuickStayOrders from "./QuickStayOrders";
import "./orders.css";

const Orders = () => {
  const [selectedTab, setSelectedTab] = useState("quickstay"); // default

  return (
    <div>
      <Navbar />

      <div className="orders-container">
        <h1>My Orders</h1>

        <div className="tab-buttons">
          <button
            className={selectedTab === "hotels" ? "active-tab" : ""}
            onClick={() => setSelectedTab("hotels")}
          >
            Hotels
          </button>
          <button
            className={selectedTab === "quickstay" ? "active-tab" : ""}
            onClick={() => setSelectedTab("quickstay")}
          >
            QuickStay
          </button>
        </div>

        <div className="orders-content">
          {selectedTab === "hotels" ? <HotelOrders /> : <QuickStayOrders />}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
