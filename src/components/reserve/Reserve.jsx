import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faUsers,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../context/SearchContext";
import "./reserve.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HotelConfirmation from "../hotelConfirmation/HotelConfirmation";

const Reserve = ({ setOpen, hotelId, days, user }) => {
  const { data, loading, error } = useFetch(`https://tourstay-server.onrender.com/api/hotels/room/${hotelId}`);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dates, options } = useContext(SearchContext);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hotelData, setHotelData] = useState(null);
  const [selectedRoomData, setSelectedRoomData] = useState([]);

  // Fetch hotel data
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const res = await axios.get(`https://tourstay-server.onrender.com/api/hotels/find/${hotelId}`);
        setHotelData(res.data);
      } catch (err) {
        console.error("Error fetching hotel data:", err);
      }
    };

    if (hotelId) {
      fetchHotelData();
    }
  }, [hotelId]);

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());

    let list = [];
    while (date <= end) {
      list.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return list;
  };
  // console.log(options.adult, options.children);
  // console.log("Selected Rooms:", selectedRoomData);
  const allDates =
    dates?.length > 0
      ? getDatesInRange(dates[0].startDate, dates[0].endDate)
      : [];

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      allDates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  const handleSelect = (e, price, roomInfo) => {
    const checked = e.target.checked;
    const value = e.target.value;
    const roomNumber = e.target.getAttribute("data-room-number");

    if (checked) {
      setSelectedRooms([...selectedRooms, value]);
      setTotalPrice((prev) => prev + price * days);

      // Add selected room data
      setSelectedRoomData((prev) => [
        ...prev,
        {
          roomId: value,
          roomNumber: roomNumber,
          title: roomInfo.title,
          price: roomInfo.price,
          maxPeople: roomInfo.maxPeople,
        },
      ]);
    } else {
      setSelectedRooms(selectedRooms.filter((item) => item !== value));
      setTotalPrice((prev) => prev - price * days);

      // Remove room data
      setSelectedRoomData((prev) =>
        prev.filter((room) => room.roomId !== value)
      );
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    if (selectedRooms.length === 0) return;

    // Show confirmation modal instead of directly processing booking
    setShowConfirmation(true);
  };

  const handlePaymentSuccess = async (paymentInfo) => {
    setIsSubmitting(true);
    try {
      // Process room availability
      await Promise.all(
        selectedRooms.map(async (roomId) => {
          const res = await axios.put(`/rooms/availability/${roomId}`, {
            dates: allDates,
          });
          return res.data;
        })
      );

      // Create booking record
      const bookingData = {
        userId: user?._id || "guest",
        hotelId: hotelId,
        rooms: selectedRooms,
        dateRange: {
          startDate: dates[0].startDate,
          endDate: dates[0].endDate,
        },
        totalAmount: totalPrice,
        paymentInfo: paymentInfo,
      };

      await axios.post("/bookings", bookingData);

      setOpen(false);
      navigate("/confirmation");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="reserve">
        <div className="rContainer">
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="rClose"
            onClick={() => setOpen(false)}
          />
          <div className="rHeader">
            <h2>Select your rooms</h2>
            <p>
              Booking for {days} {days === 1 ? "night" : "nights"}
            </p>
          </div>

          {loading ? (
            <div className="rLoading">
              <FontAwesomeIcon icon={faSpinner} spin /> Loading rooms...
            </div>
          ) : error ? (
            <p className="rError">Error loading rooms. Please try again.</p>
          ) : (
            <div className="rRoomsList">
              {Array.isArray(data) && data.length > 0 ? (
                data.map((item) => (
                  <div className="rItem" key={item._id}>
                    <div className="rItemInfo">
                      <div className="rTitle">{item.title}</div>
                      <div className="rDesc">{item.desc}</div>
                      <div className="rDetails">
                        <div className="rDetailItem">
                          <FontAwesomeIcon icon={faUsers} />
                          <span>Max People: {item.maxPeople}</span>
                        </div>
                        <div className="rPrice">
                          <span className="rPriceLabel">Price per night:</span>
                          <span className="rPriceValue">BDT {item.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="rSelectRooms">
                      {Array.isArray(item.roomNumbers) &&
                        item.roomNumbers.map((roomNumber) => (
                          <div className="room" key={roomNumber._id}>
                            <label
                              htmlFor={roomNumber._id}
                              className="roomLabel"
                            >
                              Room {roomNumber.number}
                            </label>
                            <input
                              type="checkbox"
                              id={roomNumber._id}
                              value={roomNumber._id}
                              data-room-number={roomNumber.number}
                              onChange={(e) =>
                                handleSelect(e, item.price, item)
                              }
                              disabled={
                                !isAvailable(roomNumber) || isSubmitting
                              }
                            />
                            {!isAvailable(roomNumber) && (
                              <span className="unavailable">Booked</span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="rError">No rooms available for booking</p>
              )}
            </div>
          )}

          <div className="rSummary">
            <div className="rTotal">
              <span>
                Total ({selectedRooms.length}{" "}
                {selectedRooms.length === 1 ? "room" : "rooms"}):
              </span>
              <span className="rTotalPrice">BDT {totalPrice}</span>
            </div>
            <button
              onClick={handleClick}
              className="rButton"
              disabled={selectedRooms.length === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Processing...
                </>
              ) : (
                <>
                  Continue to Checkout {totalPrice > 0 && `(BDT ${totalPrice})`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <HotelConfirmation
          hotelData={hotelData}
          roomData={selectedRoomData}
          roomNumbers={selectedRoomData.map((room) => room.roomNumber)}
          dateRange={dates[0]}
          adults={options.adult}
          childrens={options.children}
          closeConfirmation={closeConfirmation}
          onPaymentSuccess={handlePaymentSuccess}
          customerId={user?._id}
          totalAmount={totalPrice}
        />
      )}
    </>
  );
};

export default Reserve;
