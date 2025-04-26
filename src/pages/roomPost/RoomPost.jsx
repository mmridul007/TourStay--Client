import React, { useState } from "react";
import "./roomPost.css";
import ManageRoom from "./manageRoom/ManageRoom";
import Transaction from "./transaction/Transaction";

const RoomPost = ({ id }) => {
  // State to track the active section
  const [activeSection, setActiveSection] = useState("manageRooms");

  // Handler to change the active section
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="container">
      <div className="containerHeader">
        <h2>Your unused rooms</h2>
        <hr />
      </div>

      <div className="itemTitle">
        <span
          className={activeSection === "manageRooms" ? "active" : ""}
          onClick={() => handleSectionChange("manageRooms")}
        >
          Manage rooms
        </span>
        <span
          className={activeSection === "transactions" ? "active" : ""}
          onClick={() => handleSectionChange("transactions")}
        >
          Transactions
        </span>
      </div>

      <div className="sectionContent">
        {activeSection === "manageRooms" && (
          <div className="manageRoomsContent">
            {/* <h3>Manage Your Rooms</h3>
            <p>Here you can view and manage your unused rooms.</p> */}
            <ManageRoom userId={id}/>
            {/* Add your manage rooms content here */}
          </div>
        )}

        {activeSection === "transactions" && (
          <div className="transactionsContent">
            {/* <h3>Transaction History</h3>
            <p>View your recent transactions and booking history.</p> */}
            <Transaction id={id}/>
            {/* Add your transactions content here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPost;
