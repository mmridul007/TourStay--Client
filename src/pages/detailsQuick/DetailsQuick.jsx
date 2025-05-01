// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import useFetch from "../../hooks/useFetch";
// import { DateRange } from "react-date-range";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";
// import { format } from "date-fns";
// import "./detailsQuick.css";
// import Navbar from "../../components/navbar/Navbar";
// import Footer from "../../components/footer/Footer";
// import OrderConfirmation from "../../components/orderConfirmation/OrderConfirmation";
// import { AuthContext } from "../../components/context/AuthContext";

// const DetailsQuick = () => {
//   const { id } = useParams();
//   const { data, loading, error } = useFetch(`/quickRooms/find/${id}`);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [dateRange, setDateRange] = useState([
//     {
//       startDate: new Date(),
//       endDate: new Date(),
//       key: "selection",
//     },
//   ]);
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
//   const [openDate, setOpenDate] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const [disabledDates, setDisabledDates] = useState([]);

//   useEffect(() => {
//     if (data?.unavailableDates) {
//       const dates = data.unavailableDates.map((date) => {
//         const d = typeof date === "string" ? new Date(date) : date;
//         return new Date(d.setHours(0, 0, 0, 0));
//       });
//       setDisabledDates(dates);
//     }
//   }, [data]);

//   const handleDateSelect = (ranges) => {
//     setDateRange([ranges.selection]);
//   };

//   const nextPhoto = () => {
//     setCurrentPhotoIndex((prev) =>
//       prev === data.photos.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevPhoto = () => {
//     setCurrentPhotoIndex((prev) =>
//       prev === 0 ? data.photos.length - 1 : prev - 1
//     );
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">Error: {error.message}</div>;
//   if (!data) return <div className="not-found">Room not found</div>;

//   const startDate = dateRange[0].startDate;
//   const endDate = dateRange[0].endDate;
//   const daysDifference =
//     Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
//   const totalPrice = daysDifference * data.cheapestPrice;

//   const cleanCoordinates = (coordString) => {
//     if (!coordString) return "0,0"; // Default fallback
//     return coordString.replace(/\s/g, "").split(",").slice(0, 2).join(",");
//   };

//   const handleBookNowClick = () => {
//     // Check if user is logged in
//     if (!user) {
//       // Save current page URL to redirect back after login
//       // Using state to pass the return location
//       navigate("/login", {
//         state: {
//           returnUrl: location.pathname,
//           dateInfo: {
//             startDate: dateRange[0].startDate.toISOString(),
//             endDate: dateRange[0].endDate.toISOString(),
//           },
//         },
//       });
//       return;
//     }

//     // If user is logged in, proceed with booking
//     setShowConfirmation(true);
//   };

//   const handlePaymentSuccess = () => {
//     setShowConfirmation(false);
//     setBookingSuccess(true);
//     // Refresh the data to update the unavailable dates
//     window.location.reload();
//   };

//   const isDateRangeAvailable = () => {
//     const selectedDates = [];
//     let current = new Date(dateRange[0].startDate);
//     const end = new Date(dateRange[0].endDate);

//     while (current <= end) {
//       selectedDates.push(new Date(current.setHours(0, 0, 0, 0)));
//       current = new Date(current);
//       current.setDate(current.getDate() + 1);
//     }

//     return !selectedDates.some((date) =>
//       disabledDates.some(
//         (disabled) => date.getTime() === new Date(disabled).getTime()
//       )
//     );
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="details-container">
//         <div className="quick-room-details">
//           <h1 className="room-title">{data.title}</h1>
//           <p className="room-location">
//             {data.address}, {data.city}
//           </p>

//           {/* Photo Gallery */}
//           <div className="photo-gallery">
//             {data.photos?.length > 0 && (
//               <>
//                 <img
//                   src={data.photos[currentPhotoIndex]}
//                   alt={data.title}
//                   className="main-photo"
//                 />
//                 <button className="nav-button prev" onClick={prevPhoto}>
//                   &lt;
//                 </button>
//                 <button className="nav-button next" onClick={nextPhoto}>
//                   &gt;
//                 </button>
//                 <div className="thumbnail-container">
//                   {data.photos.map((photo, index) => (
//                     <img
//                       key={index}
//                       src={photo}
//                       alt={`Thumbnail ${index + 1}`}
//                       className={`thumbnail ${
//                         index === currentPhotoIndex ? "active" : ""
//                       }`}
//                       onClick={() => setCurrentPhotoIndex(index)}
//                     />
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="details-content">
//             <div className="main-content">
//               <div className="room-info">
//                 <h2>About this space</h2>
//                 <p>{data.desc}</p>

//                 <h2>Amenities</h2>
//                 <div className="amenities-grid">
//                   {data.isWifiAvailable && <div className="amenity">WiFi</div>}
//                   {data.isParkingAvailable && (
//                     <div className="amenity">Parking</div>
//                   )}
//                   {data.kitchen && <div className="amenity">Kitchen</div>}
//                   {data.refrigerator && (
//                     <div className="amenity">Refrigerator</div>
//                   )}
//                   {data.oven && <div className="amenity">Oven</div>}
//                   {data.diningRoom && (
//                     <div className="amenity">Dining Room</div>
//                   )}
//                   {data.isGasAvailable && <div className="amenity">Gas</div>}
//                 </div>

//                 <h2>Room Details</h2>
//                 <div className="room-specs">
//                   <div className="spec">
//                     <span>Type:</span>
//                     <span>{data.roomType}</span>
//                   </div>
//                   <div className="spec">
//                     <span>Max Guests:</span>
//                     <span>{data.maxPeople}</span>
//                   </div>
//                   <div className="spec">
//                     <span>Bedrooms:</span>
//                     <span>{data.totalBedrooms}</span>
//                   </div>
//                   <div className="spec">
//                     <span>Beds:</span>
//                     <span>{data.totalBeds}</span>
//                   </div>
//                   <div className="spec">
//                     <span>Bathrooms:</span>
//                     <span>{data.totalBathrooms}</span>
//                   </div>
//                   <div className="spec">
//                     <span>Bathroom Type:</span>
//                     <span>{data.bathRoomType}</span>
//                   </div>
//                 </div>

//                 <h2>House Rules</h2>
//                 <div className="house-rules">
//                   <div className="rule">
//                     <span>Smoking Allowed:</span>
//                     <span>{data.isSmokingAllowed ? "Yes" : "No"}</span>
//                     {data.messageOfSmoking && <p>{data.messageOfSmoking}</p>}
//                   </div>
//                   <div className="rule">
//                     <span>Pets Allowed:</span>
//                     <span>{data.isPetAllowed ? "Yes" : "No"}</span>
//                     {data.messageOfPet && <p>{data.messageOfPet}</p>}
//                   </div>
//                   {data.whichPeopleAreAllowed && (
//                     <div className="rule">
//                       <span>Suitable for:</span>
//                       <span>{data.whichPeopleAreAllowed}</span>
//                     </div>
//                   )}
//                 </div>

//                 <h2>Location</h2>
//                 <div className="map-container">
//                   <iframe
//                     title="Room Location"
//                     width="100%"
//                     height="400"
//                     frameBorder="0"
//                     scrolling="no"
//                     marginHeight="0"
//                     marginWidth="0"
//                     src={`https://maps.google.com/maps?q=${cleanCoordinates(
//                       data.mapLocation
//                     )}&z=15&output=embed`}
//                   ></iframe>
//                 </div>
//               </div>
//             </div>

//             <div className="booking-sidebar">
//               <div className="price-box">
//                 <h3>BDT {data.cheapestPrice}/day</h3>

//                 <div className="date-selection">
//                   <div
//                     className="date-input"
//                     onClick={() => setOpenDate(!openDate)}
//                   >
//                     <div>
//                       <span>Check In</span>
//                       <p>{format(dateRange[0].startDate, "dd MMM, yyyy")}</p>
//                     </div>
//                     <div>
//                       <span>Check Out</span>
//                       <p>{format(dateRange[0].endDate, "dd MMM, yyyy")}</p>
//                     </div>
//                   </div>
//                   {openDate && (
//                     <DateRange
//                       editableDateInputs={true}
//                       onChange={handleDateSelect}
//                       moveRangeOnFirstSelection={false}
//                       ranges={dateRange}
//                       minDate={new Date()}
//                       disabledDates={disabledDates}
//                       className="date-range-picker"
//                     />
//                   )}
//                 </div>

//                 <div className="guest-count">
//                   <h4>
//                     Max {data.maxPeople} Guest{data.maxPeople > 1 ? "s" : ""}
//                   </h4>
//                 </div>

//                 <div className="price-summary">
//                   <div className="price-row">
//                     <span>
//                       BDT {data.cheapestPrice} x {daysDifference} day
//                       {daysDifference > 1 ? "s" : ""}
//                     </span>
//                     <span>BDT {totalPrice}</span>
//                   </div>
//                 </div>

//                 <button
//                   className="book-now-btn"
//                   onClick={handleBookNowClick}
//                   disabled={!isDateRangeAvailable()}
//                   title={
//                     !isDateRangeAvailable()
//                       ? "Selected dates are not available"
//                       : "Proceed to booking"
//                   }
//                 >
//                   BOOK NOW
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showConfirmation && user && (
//         <OrderConfirmation
//           roomData={data}
//           dateRange={dateRange}
//           customerId={user._id}
//           ownerId={data.userID}
//           closeConfirmation={() => setShowConfirmation(false)}
//           onPaymentSuccess={handlePaymentSuccess}
//         />
//       )}

//       {bookingSuccess && (
//         <div className="booking-success-message">
//           Booking confirmed successfully!
//         </div>
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default DetailsQuick;

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import "./detailsQuick.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import OrderConfirmation from "../../components/orderConfirmation/OrderConfirmation";
import { AuthContext } from "../../components/context/AuthContext";
import { Rating } from "@mui/material";
import {
  LocationOn,
  Wifi,
  LocalParking,
  Kitchen,
  KitchenOutlined,
  Microwave,
  Restaurant,
  LocalGasStation,
  SmokingRooms,
  Pets,
  PeopleAlt,
  Star,
} from "@mui/icons-material";

const DetailsQuick = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch(
    `https://tourstay-server.onrender.com/api/quickRooms/find/${id}`
  );
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  // console.log(loggedInUser._id)

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [openDate, setOpenDate] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [disabledDates, setDisabledDates] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    if (data?.unavailableDates) {
      const dates = data.unavailableDates.map((date) => {
        const d = typeof date === "string" ? new Date(date) : date;
        return new Date(d.setHours(0, 0, 0, 0));
      });
      setDisabledDates(dates);
    }
  }, [data]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (id) {
        try {
          setLoadingReviews(true);
          const response = await fetch(
            `https://tourstay-server.onrender.com/api/roomReview/findForRoom/${id}`
          );
          const reviewsData = await response.json();

          // Get user details for each review
          const reviewsWithUserDetails = await Promise.all(
            reviewsData.map(async (review) => {
              try {
                const userResponse = await fetch(
                  `https://tourstay-server.onrender.com/api/users/${review.userId}`
                );
                const userData = await userResponse.json();
                return {
                  ...review,
                  username: userData.username || "Anonymous",
                  userImg: userData.img || null,
                };
              } catch (error) {
                return {
                  ...review,
                  username: "Anonymous",
                  userImg: null,
                };
              }
            })
          );

          setReviews(reviewsWithUserDetails);
        } catch (error) {
          console.error("Failed to fetch reviews:", error);
        } finally {
          setLoadingReviews(false);
        }
      }
    };

    fetchReviews();
  }, [id]);

  const handleDateSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === data.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? data.photos.length - 1 : prev - 1
    );
  };

  if (loading)
    return (
      <div className="loadingSpinner">
        <div className="spinner"></div>
        <p>Loading Please Wait</p>
      </div>
    );
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!data) return <div className="not-found">Room not found</div>;

  const startDate = dateRange[0].startDate;
  const endDate = dateRange[0].endDate;
  const daysDifference =
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
  const totalPrice = daysDifference * data.cheapestPrice;

  const cleanCoordinates = (coordString) => {
    if (!coordString) return "0,0"; // Default fallback
    return coordString.replace(/\s/g, "").split(",").slice(0, 2).join(",");
  };

  const handleBookNowClick = () => {
    // Check if user is logged in
    if (!user) {
      // Save current page URL to redirect back after login
      // Using state to pass the return location
      navigate("/login", {
        state: {
          returnUrl: location.pathname,
          dateInfo: {
            startDate: dateRange[0].startDate.toISOString(),
            endDate: dateRange[0].endDate.toISOString(),
          },
        },
      });
      return;
    }

    // If user is logged in, proceed with booking
    setShowConfirmation(true);
  };

  const handlePaymentSuccess = () => {
    setShowConfirmation(false);
    setBookingSuccess(true);
    // Refresh the data to update the unavailable dates
    window.location.reload();
  };

  const isDateRangeAvailable = () => {
    const selectedDates = [];
    let current = new Date(dateRange[0].startDate);
    const end = new Date(dateRange[0].endDate);

    while (current <= end) {
      selectedDates.push(new Date(current.setHours(0, 0, 0, 0)));
      current = new Date(current);
      current.setDate(current.getDate() + 1);
    }

    return !selectedDates.some((date) =>
      disabledDates.some(
        (disabled) => date.getTime() === new Date(disabled).getTime()
      )
    );
  };

  // Calculate average rating
  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : 0;

  return (
    <div>
      <Navbar />
      <div className="details-container">
        <div className="quick-room-details">
          <div className="title-rating-container">
            <div className="title-section">
              <h1 className="room-title">{data.title}</h1>
              <p className="room-location">
                <LocationOn
                  style={{
                    fontSize: 16,
                    verticalAlign: "middle",
                    marginRight: "5px",
                  }}
                />
                {data.address}, {data.city}
              </p>
            </div>
            <div className="rating-section">
              <div className="rating-display">
                <Star style={{ color: "#FFC107", marginRight: "5px" }} />
                <span className="rating-number">{averageRating}</span>
                <Rating
                  value={parseFloat(averageRating)}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <span className="total-reviews">
                  ({reviews.length} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="photo-gallery">
            {data.photos?.length > 0 && (
              <>
                <img
                  src={data.photos[currentPhotoIndex]}
                  alt={data.title}
                  className="main-photo"
                />
                <button className="nav-button prev" onClick={prevPhoto}>
                  &lt;
                </button>
                <button className="nav-button next" onClick={nextPhoto}>
                  &gt;
                </button>
                <div className="thumbnail-container">
                  {data.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className={`thumbnail ${
                        index === currentPhotoIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentPhotoIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="details-content">
            <div className="main-content">
              <div className="room-info">
                <h2>About this space</h2>
                <p>{data.desc}</p>

                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {data.isWifiAvailable && (
                    <div className="amenity">
                      <Wifi style={{ marginRight: "5px" }} />
                      WiFi
                    </div>
                  )}
                  {data.isParkingAvailable && (
                    <div className="amenity">
                      <LocalParking style={{ marginRight: "5px" }} />
                      Parking
                    </div>
                  )}
                  {data.kitchen && (
                    <div className="amenity">
                      <Kitchen style={{ marginRight: "5px" }} />
                      Kitchen
                    </div>
                  )}
                  {data.refrigerator && (
                    <div className="amenity">
                      <KitchenOutlined style={{ marginRight: "5px" }} />
                      Refrigerator
                    </div>
                  )}
                  {data.oven && (
                    <div className="amenity">
                      <Microwave style={{ marginRight: "5px" }} />
                      Oven
                    </div>
                  )}
                  {data.diningRoom && (
                    <div className="amenity">
                      <Restaurant style={{ marginRight: "5px" }} />
                      Dining Room
                    </div>
                  )}
                  {data.isGasAvailable && (
                    <div className="amenity">
                      <LocalGasStation style={{ marginRight: "5px" }} />
                      Gas
                    </div>
                  )}
                </div>

                <h2>Room Details</h2>
                <div className="room-specs">
                  <div className="spec">
                    <span>Type:</span>
                    <span>{data.roomType}</span>
                  </div>
                  <div className="spec">
                    <span>Max Guests:</span>
                    <span>{data.maxPeople}</span>
                  </div>
                  <div className="spec">
                    <span>Bedrooms:</span>
                    <span>{data.totalBedrooms}</span>
                  </div>
                  <div className="spec">
                    <span>Beds:</span>
                    <span>{data.totalBeds}</span>
                  </div>
                  <div className="spec">
                    <span>Bathrooms:</span>
                    <span>{data.totalBathrooms}</span>
                  </div>
                  <div className="spec">
                    <span>Bathroom Type:</span>
                    <span>{data.bathRoomType}</span>
                  </div>
                </div>

                {/* Section 1: Required Documents for Check-in */}
                <h2>Required Documents for Check-in</h2>
                <div className="required-documents">
                  {data.requiredDocuments &&
                  data.requiredDocuments.length > 0 ? (
                    <ul className="documents-list">
                      {data.requiredDocuments.map((document, index) => (
                        <li key={index} className="document-item">
                          <span className="document-icon">📄</span>
                          <span className="document-name">{document}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No specific documents required for check-in.</p>
                  )}
                </div>

                {/* Section 2: Things to Know - Cancellation Policy */}
                <h2>Things to Know</h2>
                <div className="things-to-know">
                  <h3>Cancellation Policy</h3>
                  <ul className="cancellation-policy">
                    <li>
                      80% of the total booking amount will be refunded if it's
                      cancelled 24 hours before the check-in date.
                    </li>
                    <li>
                      This applies only for bookings more than 1 Day. No amount
                      will be refunded for single day bookings.
                    </li>
                  </ul>

                  <div className="utility-info">
                    <h3>Utilities</h3>
                    {data.electricityTime && (
                      <div className="utility-item">
                        <span>Electricity: </span>
                        <span>{data.electricityTime}</span>
                      </div>
                    )}
                    {data.waterTime && (
                      <div className="utility-item">
                        <span>Water: </span>
                        <span>{data.waterTime}</span>
                      </div>
                    )}
                    <div className="utility-item">
                      <span>Gas: </span>
                      <span>
                        {data.isGasAvailable ? "Available" : "Not Available"}
                      </span>
                    </div>
                  </div>
                </div>

                <h2>House Rules</h2>
                <div className="house-rules">
                  <div className="rule">
                    <span>
                      <SmokingRooms
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />
                      Smoking Allowed:
                    </span>
                    <span>{data.isSmokingAllowed ? "Yes" : "No"}</span>
                    {data.messageOfSmoking && <p>{data.messageOfSmoking}</p>}
                  </div>
                  <div className="rule">
                    <span>
                      <Pets
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />
                      Pets Allowed:
                    </span>
                    <span>{data.isPetAllowed ? "Yes" : "No"}</span>
                    {data.messageOfPet && <p>{data.messageOfPet}</p>}
                  </div>
                  {data.whichPeopleAreAllowed && (
                    <div className="rule">
                      <span>
                        <PeopleAlt
                          style={{
                            verticalAlign: "middle",
                            marginRight: "5px",
                          }}
                        />
                        Suitable for:
                      </span>
                      <span>{data.whichPeopleAreAllowed}</span>
                    </div>
                  )}
                  {/* {data.whichTypeOfPeopleAreNotAllowed &&
                    data.whichTypeOfPeopleAreNotAllowed.length > 0 && (
                      <div className="rule">
                        <span>Not suitable for:</span>
                        <span>
                          {data.whichTypeOfPeopleAreNotAllowed.join(", ")}
                        </span>
                      </div>
                    )} */}
                </div>

                {/* Section 3: Reviews */}
                <h2>Reviews</h2>
                <div className="reviews-section">
                  <div className="reviews-summary">
                    <div className="average-rating">
                      <span className="rating-number">{averageRating}</span>
                      <Rating
                        value={parseFloat(averageRating)}
                        precision={0.5}
                        readOnly
                      />
                      <span className="total-reviews">
                        ({reviews.length} reviews)
                      </span>
                    </div>
                  </div>

                  {loadingReviews ? (
                    <div className="loading-reviews">Loading reviews...</div>
                  ) : reviews.length > 0 ? (
                    <div className="reviews-list">
                      {reviews.map((review) => (
                        <div key={review._id} className="review-card">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <div className="reviewer-avatar">
                                {review.userImg ? (
                                  <img
                                    src={review.userImg}
                                    alt={review.username}
                                  />
                                ) : (
                                  <div className="default-avatar">
                                    {review.username.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="reviewer-details">
                                <h4 className="reviewer-name">
                                  {review.username}
                                </h4>
                                <span className="review-date">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="review-rating">
                              <Rating value={review.rating} readOnly />
                            </div>
                          </div>
                          <div className="review-content">
                            <p>{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-reviews">
                      No reviews yet for this property.
                    </div>
                  )}
                </div>

                <h2>Location</h2>
                <div className="map-container">
                  <iframe
                    title="Room Location"
                    width="100%"
                    height="400"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://maps.google.com/maps?q=${cleanCoordinates(
                      data.mapLocation
                    )}&z=15&output=embed`}
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="booking-sidebar">
              <div className="price-box">
                <h3>BDT {data.cheapestPrice}/day</h3>

                <div className="date-selection">
                  <div
                    className="date-input"
                    onClick={() => setOpenDate(!openDate)}
                  >
                    <div>
                      <span>Check In</span>
                      <p>{format(dateRange[0].startDate, "dd MMM, yyyy")}</p>
                    </div>
                    <div>
                      <span>Check Out</span>
                      <p>{format(dateRange[0].endDate, "dd MMM, yyyy")}</p>
                    </div>
                  </div>
                  {openDate && (
                    <DateRange
                      editableDateInputs={true}
                      onChange={handleDateSelect}
                      moveRangeOnFirstSelection={false}
                      ranges={dateRange}
                      minDate={new Date()}
                      disabledDates={disabledDates}
                      className="date-range-picker"
                    />
                  )}
                </div>

                <div className="guest-count">
                  <h4>
                    Max {data.maxPeople} Guest{data.maxPeople > 1 ? "s" : ""}
                  </h4>
                </div>

                <div className="price-summary">
                  <div className="price-row">
                    <span>
                      BDT {data.cheapestPrice} x {daysDifference} day
                      {daysDifference > 1 ? "s" : ""}
                    </span>
                    <span>BDT {totalPrice}</span>
                  </div>
                </div>

                <button
                  className="book-now-btn"
                  onClick={handleBookNowClick}
                  disabled={
                    !isDateRangeAvailable() || loggedInUser?._id === data.userID
                  }
                  title={
                    !isDateRangeAvailable()
                      ? "Selected dates are not available"
                      : loggedInUser?._id === data.userID
                      ? "Owner of this room can't book this room"
                      : "Proceed to booking"
                  }
                >
                  BOOK NOW
                </button>

                {loggedInUser?._id === data.userID && (
                  <div className="ownerMessage">
                    Owner of this room can't book this room
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && user && (
        <OrderConfirmation
          roomData={data}
          dateRange={dateRange}
          customerId={user._id}
          ownerId={data.userID}
          closeConfirmation={() => setShowConfirmation(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {bookingSuccess && (
        <div className="booking-success-message">
          Booking confirmed successfully!
        </div>
      )}
      <Footer />
    </div>
  );
};

export default DetailsQuick;
