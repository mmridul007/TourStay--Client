import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import axios from "axios";
import "./quickStay.css";
import { useNavigate, useLocation } from "react-router-dom";

const QuickStay = () => {
  const [city, setCity] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Check if there are persisted search results in location state
  useEffect(() => {
    // Try to retrieve data from location state or sessionStorage
    const storedResults = sessionStorage.getItem("searchResults");
    const storedCity = sessionStorage.getItem("searchedCity");

    if (storedResults && storedCity) {
      setRooms(JSON.parse(storedResults));
      setCity(storedCity);
    } else if (location.state?.searchResults) {
      setRooms(location.state.searchResults);
      setCity(location.state.city || "");
    }
  }, [location.state]);

  const handleSearch = async (cityToSearch = city) => {
    const trimmedCity = cityToSearch.trim();
    if (!trimmedCity) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setRooms([]);

    try {
      const response = await axios.get(
        `https://tourstay-server.onrender.com/api/quickrooms/search/city`,
        {
          params: { city: trimmedCity },
        }
      );

      setRooms(response.data);
      setCity(trimmedCity);

      // Save search results and city in sessionStorage
      sessionStorage.setItem("searchResults", JSON.stringify(response.data));
      sessionStorage.setItem("searchedCity", trimmedCity);

      if (response.data.length === 0) {
        setError(`No rooms found in ${trimmedCity}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch rooms. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomDetails = (roomId) => {
    navigate(`/quickrooms/${roomId}`, {
      state: {
        searchResults: rooms,
        city: city,
        fromSearch: true,
      },
    });
  };

  return (
    <div>
      <Navbar />
      <div className="quick-stay-container">
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="city-input"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="search-btn"
            >
              {loading ? "Searching..." : "Search Rooms"}
            </button>
          </div>
        </div>

        <div className="rooms-container">
          {error && (
            <div className="no-rooms-message">
              <p>{error}</p>
            </div>
          )}

          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room._id} className="room-card">
                <div className="room-image">
                  {room.photos && room.photos.length > 0 ? (
                    <img
                      src={room.photos[0]}
                      alt={room.title}
                      className="room-thumbnail"
                    />
                  ) : (
                    <div className="no-image-placeholder">No Image</div>
                  )}
                </div>
                <div className="room-details">
                  <h3>{room.title}</h3>
                  <div className="room-info">
                    <span>Room Type: {room.roomType}</span>
                    <span>
                      Price: BDT{" "}
                      <span className="price">{room.cheapestPrice}</span>/night
                    </span>
                    <span>City: {room.city}</span>
                    <span>Address: {room.address}</span>
                    <span>
                      Available for Rent:{" "}
                      {room.isAvailableForRent ? (
                        <span className="available">Available</span>
                      ) : (
                        <span className="notAvailable">Unavailable</span>
                      )}
                    </span>
                  </div>
                  <div className="room-actions">
                    <button
                      className="details-btn"
                      onClick={() => handleRoomDetails(room._id)}
                    >
                      See Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuickStay;
