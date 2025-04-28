import React from "react";
import { useNavigate } from "react-router-dom";

const QuickStayList = (props) => {
  const { quickStays, actionProvider } = props;
  const displayedRooms = quickStays.slice(0, 3);
  const navigate = useNavigate();
  if (!quickStays || quickStays.length === 0) {
    return <p>No quick stays found.</p>;
  }

  const handleBookNow = (hotelId) => {
    navigate(`/quickrooms/${hotelId}`);
  };

  return (
    <div className="quick-stay-list-container">
      {displayedRooms.map((room, index) => (
        <div key={index} className="quick-stay-card">
          <div className="room-name">🏠 {room.title}</div>
          <div className="room-price">⏱️ {room.cheapestPrice} BDT/night</div>
          <div className="room-location">📍 {room.address}</div>
          <button
            onClick={() => handleBookNow(room._id)} 
            className="book-button"
          >
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuickStayList;
