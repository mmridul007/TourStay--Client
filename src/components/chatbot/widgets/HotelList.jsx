import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook

const HotelList = (props) => {
  const { hotels } = props;
  const displayedHotels = hotels.slice(0, 3);

  const navigate = useNavigate(); // ✅ initialize navigation

  if (!hotels || hotels.length === 0) {
    return <p>No hotels found.</p>;
  }

  const handleBookNow = (hotelId) => {
    navigate(`/hotels/${hotelId}`); // ✅ go to the hotel detail page
  };

  return (
    <div className="hotel-list-container">
      {displayedHotels.map((hotel) => (
        <div key={hotel._id} className="hotel-card">
          <div className="hotel-name">🏨 {hotel.name}</div>
          <div className="hotel-rating">⭐ {hotel.rating} stars</div>
          <div className="hotel-price">💰 {hotel.cheapestPrice} BDT/night</div>
          <div className="hotel-location">📍 {hotel.address}</div>
          <button
            onClick={() => handleBookNow(hotel._id)} // ✅ pass the correct hotel._id
            className="book-button"
          >
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default HotelList;
