// import "./hotel.css";
// import Navbar from "../../components/navbar/Navbar";
// import Footer from "../../components/footer/Footer";
// import { useContext, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import useFetch from "../../hooks/useFetch";
// import { SearchContext } from "../../components/context/SearchContext";
// import { AuthContext } from "../../components/context/AuthContext";
// import Reserve from "../../components/reserve/Reserve";

// // Material UI Icons
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import RoomIcon from "@mui/icons-material/Room";
// import PhoneIcon from "@mui/icons-material/Phone";
// import EmailIcon from "@mui/icons-material/Email";
// import LanguageIcon from "@mui/icons-material/Language";
// import LocalParkingIcon from "@mui/icons-material/LocalParking";
// import WifiIcon from "@mui/icons-material/Wifi";
// import RestaurantIcon from "@mui/icons-material/Restaurant";
// import PoolIcon from "@mui/icons-material/Pool";
// import BedIcon from "@mui/icons-material/Bed";
// import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
// import RoomServiceIcon from "@mui/icons-material/RoomService";
// import AcUnitIcon from "@mui/icons-material/AcUnit";
// import LocalBarIcon from "@mui/icons-material/LocalBar";
// import BeachAccessIcon from "@mui/icons-material/BeachAccess";
// import SpaIcon from "@mui/icons-material/Spa";
// import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
// import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
// import PetsIcon from "@mui/icons-material/Pets";
// import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import CloseIcon from "@mui/icons-material/Close";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import IconButton from "@mui/material/IconButton";

// const Hotel = () => {
//   const { id } = useParams();
//   const [slideNumber, setSlideNumber] = useState(0);
//   const [open, setOpen] = useState(false);
//   const [openModal, setOpenModal] = useState(false);
//   const [reviewsModalOpen, setReviewsModalOpen] = useState(false);

//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleClick = () => {
//     if (user) {
//       setOpenModal(true);
//     } else {
//       navigate("/login");
//     }
//   };

//   const { data, loading, error } = useFetch(
//     `https://tourstay-server.onrender.com/api/hotels/find/${id}`
//   );

//   const { dates, options } = useContext(SearchContext);

//   function dayDifference(date1, date2) {
//     if (!date1 || !date2) return 1; // Default to 1 day if dates are missing

//     try {
//       const d1 = new Date(date1);
//       const d2 = new Date(date2);
//       const timeDiff = Math.abs(d2.getTime() - d1.getTime());
//       return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
//     } catch (e) {
//       console.error("Date calculation error:", e);
//       return 1; // Fallback to 1 day
//     }
//   }

//   // Calculate days - handle both possible date formats
//   const days =
//     dates?.length >= 2
//       ? dayDifference(dates[0], dates[1])
//       : dates?.[0]?.startDate // Alternative format check
//       ? dayDifference(dates[0].startDate, dates[0].endDate)
//       : 1;

//   const handleOpen = (i) => {
//     setSlideNumber(i);
//     setOpen(true);
//   };

//   const handleMove = (direction) => {
//     let newSlideNumber;

//     if (direction === "l") {
//       newSlideNumber =
//         slideNumber === 0 ? data.photos.length - 1 : slideNumber - 1;
//     } else {
//       newSlideNumber =
//         slideNumber === data.photos.length - 1 ? 0 : slideNumber + 1;
//     }

//     setSlideNumber(newSlideNumber);
//   };

//   const cleanCoordinates = (mapLocation) => {
//     return mapLocation ? mapLocation.replace(/\s/g, "") : "";
//   };

//   const amenityIcons = {
//     WiFi: <WifiIcon />,
//     Pool: <PoolIcon />,
//     Gym: <FitnessCenterIcon />,
//     Parking: <LocalParkingIcon />,
//     Restaurant: <RestaurantIcon />,
//     "Room Service": <RoomServiceIcon />,
//     "24/7 Front Desk": <AccessTimeIcon />,
//     "Air Conditioning": <AcUnitIcon />,
//     Bar: <LocalBarIcon />,
//     "Beach Access": <BeachAccessIcon />,
//     Spa: <SpaIcon />,
//     "Free Breakfast": <FreeBreakfastIcon />,
//     "Airport Shuttle": <AirportShuttleIcon />,
//     "Pet Friendly": <PetsIcon />,
//     "Business Center": <BusinessCenterIcon />,
//   };

//   // Function to get amenity icon
//   const getAmenityIcon = (amenity) => {
//     return amenityIcons[amenity] || <BedIcon />;
//   };

//   return (
//     <div>
//       <Navbar />
//       <div type="list" />
//       {loading ? (
//         <div className="loadingSpinner">
//           <div className="spinner"></div>
//           <p>Loading Please Wait</p>
//         </div>
//       ) : (
//         <div className="hotelContainer">
//           {open && (
//             <div className="slider">
//               <CloseIcon className="close" onClick={() => setOpen(false)} />
//               <ArrowBackIosNewIcon
//                 className="arrow"
//                 onClick={() => handleMove("l")}
//               />
//               <div className="sliderWrapper">
//                 <img
//                   src={data.photos[slideNumber]}
//                   alt=""
//                   className="sliderImg"
//                 />
//               </div>
//               <ArrowForwardIosIcon
//                 className="arrow"
//                 onClick={() => handleMove("r")}
//               />
//             </div>
//           )}
//           <div className="hotelWrapper">
//             <div className="hotelHeader">
//               <h1 className="hotelTitle">{data.name}</h1>
//               {data.rating > 0 && (
//                 <div className="hotelHeaderRating">
//                   <span className="ratingScore">{data.rating.toFixed(1)}</span>
//                   <div className="ratingStars">
//                     {[...Array(5)].map((_, i) => (
//                       <span
//                         key={i}
//                         className={
//                           i < Math.round(data.rating) ? "star filled" : "star"
//                         }
//                       >
//                         ★
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="hotelAddressWrapper">
//               <div className="hotelAddress">
//                 <LocationOnIcon />
//                 <span>{data.address}</span>
//               </div>
//             </div>

//             <span className="hotelDistance">
//               <RoomIcon className="distanceIcon" />
//               Excellent location – {data.distance}
//             </span>

//             <div className="hotelTypeAndStatus">
//               <span className="hotelType">{data.type}</span>
//               {data.status && (
//                 <span className={`hotelStatus ${data.status}`}>
//                   {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
//                 </span>
//               )}
//             </div>

//             <div className="hotelImages">
//               {data.photos?.map((photo, i) => (
//                 <div className="hotelImgWrapper" key={i}>
//                   <img
//                     onClick={() => handleOpen(i)}
//                     src={photo}
//                     alt=""
//                     className="hotelImg"
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="hotelDetails">
//               <div className="hotelDetailsTexts">
//                 <h2 className="hotelDetailTitle">{data.title}</h2>
//                 <p className="hotelDesc">{data.desc}</p>

//                 <h2>Amenities</h2>
//                 <div className="hotelAmenities">
//                   {data.amenities?.map((amenity, i) => (
//                     <span key={i} className="amenityTag">
//                       <span className="amenityIcon">
//                         {getAmenityIcon(amenity)}
//                       </span>
//                       {amenity}
//                     </span>
//                   ))}
//                 </div>

//                 {data.policies && (
//                   <div className="hotelPolicies">
//                     <h2>Hotel Policies</h2>
//                     <div className="policiesGrid">
//                       {data.policies.checkIn && (
//                         <div className="policyItem">
//                           <h3>Check-in</h3>
//                           <p>{data.policies.checkIn}</p>
//                         </div>
//                       )}
//                       {data.policies.checkOut && (
//                         <div className="policyItem">
//                           <h3>Check-out</h3>
//                           <p>{data.policies.checkOut}</p>
//                         </div>
//                       )}
//                       {data.policies.cancellation && (
//                         <div className="policyItem">
//                           <h3>Cancellation</h3>
//                           <p>{data.policies.cancellation}</p>
//                         </div>
//                       )}
//                       {data.policies.paymentOptions?.length > 0 && (
//                         <div className="policyItem">
//                           <h3>Payment Options</h3>
//                           <p>{data.policies.paymentOptions.join(", ")}</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <div className="hotelReviews">
//                   <h2>Guest Reviews</h2>
//                   {!data.reviews || data.reviews.length === 0 ? (
//                     <div className="noReviews">
//                       <p>No Reviews Yet</p>
//                     </div>
//                   ) : (
//                     <div className="reviewsContainer">
//                       {data.reviews.slice(0, 4).map((review, i) => (
//                         <div key={i} className="reviewItem">
//                           <div className="reviewHeader">
//                             <div className="reviewRating">
//                               {[...Array(5)].map((_, j) => (
//                                 <span
//                                   key={j}
//                                   className={
//                                     j < review.rating ? "star filled" : "star"
//                                   }
//                                 >
//                                   ★
//                                 </span>
//                               ))}
//                             </div>
//                             <span className="reviewDate">
//                               {new Date(review.date).toLocaleDateString()}
//                             </span>
//                           </div>
//                           <p className="reviewComment">{review.comment}</p>
//                         </div>
//                       ))}
//                       {data.reviews.length > 4 && (
//                         <button
//                           className="seeMoreReviews"
//                           onClick={() => setReviewsModalOpen(true)}
//                         >
//                           See all {data.reviews.length} reviews
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {data.contact && (
//                   <div className="hotelContact">
//                     <h2>Contact Information</h2>
//                     <div className="contactInfo">
//                       {data.contact.email && (
//                         <p className="contactItem">
//                           <EmailIcon className="contactIcon" />
//                           <span>{data.contact.email}</span>
//                         </p>
//                       )}
//                       {data.contact.phone && (
//                         <p className="contactItem">
//                           <PhoneIcon className="contactIcon" />
//                           <span>{data.contact.phone}</span>
//                         </p>
//                       )}
//                       {data.contact.website && (
//                         <p className="contactItem">
//                           <LanguageIcon className="contactIcon" />
//                           <span>{data.contact.website}</span>
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 <h2>Location</h2>
//                 <div className="map-container">
//                   <iframe
//                     title="Hotel Location"
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

//               <div className="hotelDetailsPrice">
//                 <h2>Perfect for a {days}-night stay!</h2>
//                 <span>
//                   Located in the heart of {data.city}, this property has an
//                   excellent location!
//                 </span>
//                 <div className="priceContainer">
//                   <span className="priceLabel">Price Starts at</span>
//                   <span className="priceValue">
//                     BDT {data.cheapestPrice?.toLocaleString() || "N/A"}
//                   </span>
//                   <span className="pricePerNight">per night</span>
//                 </div>
//                 <div className="totalPriceContainer">
//                   <span className="totalPriceLabel">
//                     Total for {days} nights:
//                   </span>
//                   <span className="totalPriceValue">
//                     BDT{" "}
//                     {(data.cheapestPrice
//                       ? data.cheapestPrice * days
//                       : 0
//                     ).toLocaleString()}
//                   </span>
//                 </div>
//                 <button
//                   className="bookingButton"
//                   onClick={handleClick}
//                   disabled={!dates || dates.length === 0}
//                   style={{
//                     backgroundColor:
//                       !dates || dates.length === 0 ? "#ccc" : "#0071c2",
//                     cursor:
//                       !dates || dates.length === 0 ? "not-allowed" : "pointer",
//                   }}
//                 >
//                   Reserve or Book Now!
//                 </button>
//                 {(!dates || dates.length === 0) && (
//                   <p
//                     style={{ color: "red", marginTop: "8px", fontSize: "14px" }}
//                   >
//                     Without selecting dates, you can't reserve.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {openModal && (
//         <Reserve setOpen={setOpenModal} hotelId={id} days={days} user={user} />
//       )}

//       {/* Reviews Modal */}
//       <Dialog
//         open={reviewsModalOpen}
//         onClose={() => setReviewsModalOpen(false)}
//         aria-labelledby="reviews-dialog-title"
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle id="reviews-dialog-title">
//           All Reviews
//           <IconButton
//             aria-label="close"
//             onClick={() => setReviewsModalOpen(false)}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <div className="allReviewsContainer">
//             {data?.reviews?.map((review, i) => (
//               <div key={i} className="reviewItem">
//                 <div className="reviewHeader">
//                   <div className="reviewRating">
//                     {[...Array(5)].map((_, j) => (
//                       <span
//                         key={j}
//                         className={j < review.rating ? "star filled" : "star"}
//                       >
//                         ★
//                       </span>
//                     ))}
//                   </div>
//                   <span className="reviewDate">
//                     {new Date(review.date).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <p className="reviewComment">{review.comment}</p>
//               </div>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Footer />
//     </div>
//   );
// };

// export default Hotel;

import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useContext, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../components/context/SearchContext";
import { AuthContext } from "../../components/context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";

// Material UI Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import WifiIcon from "@mui/icons-material/Wifi";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PoolIcon from "@mui/icons-material/Pool";
import BedIcon from "@mui/icons-material/Bed";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import SpaIcon from "@mui/icons-material/Spa";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import PetsIcon from "@mui/icons-material/Pets";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";

const Hotel = () => {
  const { id } = useParams();
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);

  // Date picker states
  const [openDate, setOpenDate] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get search context data
  const { dates, options, dispatch } = useContext(SearchContext);

  // Initialize date state from context or with defaults
  const [dateState, setDateState] = useState([
    {
      startDate: dates?.[0]?.startDate || new Date(),
      endDate:
        dates?.[0]?.endDate ||
        new Date(new Date().setDate(new Date().getDate() + 1)),
      key: "selection",
    },
  ]);

  // Initialize options state from context or with defaults
  const [optionsState, setOptionsState] = useState({
    adult: options?.adult || 1,
    children: options?.children || 0,
    room: options?.room || 1,
  });

  // Refs for handling clicks outside the dropdowns
  const dateRef = useRef(null);
  const optionsRef = useRef(null);

  const { data, loading, error } = useFetch(
    `https://tourstay-server.onrender.com/api/hotels/find/${id}`
  );

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setOpenDate(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOpenOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update search context when dates change
  useEffect(() => {
    // Only update if we have valid date ranges
    if (dateState?.[0]?.startDate && dateState?.[0]?.endDate) {
      dispatch({
        type: "NEW_SEARCH",
        payload: {
          city: data?.city || "",
          dates: dateState,
          options: optionsState,
        },
      });
    }
  }, [dateState, optionsState, data?.city, dispatch]);

  const handleClick = () => {
    if (user) {
      // Update context one final time before opening the modal
      dispatch({
        type: "NEW_SEARCH",
        payload: {
          city: data?.city || "",
          dates: dateState,
          options: optionsState,
        },
      });
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  // Handle option changes
  const handleOption = (name, operation) => {
    setOptionsState((prev) => {
      const newValue = operation === "i" ? prev[name] + 1 : prev[name] - 1;
      return {
        ...prev,
        [name]: newValue >= 0 ? newValue : 0,
      };
    });
  };

  // Handle date changes
  const handleDateChange = (item) => {
    setDateState([item.selection]);
  };

  // Update search context when date or options change
  const handleSearch = () => {
    dispatch({
      type: "NEW_SEARCH",
      payload: {
        city: data?.city || "",
        dates: dateState,
        options: optionsState,
      },
    });

    // Close the dropdowns after search
    setOpenDate(false);
    setOpenOptions(false);
  };

  function dayDifference(date1, date2) {
    if (!date1 || !date2) return 1; // Default to 1 day if dates are missing

    try {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const timeDiff = Math.abs(d2.getTime() - d1.getTime());
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    } catch (e) {
      console.error("Date calculation error:", e);
      return 1; // Fallback to 1 day
    }
  }

  // Calculate days from current context
  const days =
    dateState?.[0]?.startDate && dateState?.[0]?.endDate
      ? dayDifference(dateState[0].startDate, dateState[0].endDate)
      : 1;

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber =
        slideNumber === 0 ? data.photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === data.photos.length - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const cleanCoordinates = (mapLocation) => {
    return mapLocation ? mapLocation.replace(/\s/g, "") : "";
  };

  const amenityIcons = {
    WiFi: <WifiIcon />,
    Pool: <PoolIcon />,
    Gym: <FitnessCenterIcon />,
    Parking: <LocalParkingIcon />,
    Restaurant: <RestaurantIcon />,
    "Room Service": <RoomServiceIcon />,
    "24/7 Front Desk": <AccessTimeIcon />,
    "Air Conditioning": <AcUnitIcon />,
    Bar: <LocalBarIcon />,
    "Beach Access": <BeachAccessIcon />,
    Spa: <SpaIcon />,
    "Free Breakfast": <FreeBreakfastIcon />,
    "Airport Shuttle": <AirportShuttleIcon />,
    "Pet Friendly": <PetsIcon />,
    "Business Center": <BusinessCenterIcon />,
  };

  // Function to get amenity icon
  const getAmenityIcon = (amenity) => {
    return amenityIcons[amenity] || <BedIcon />;
  };

  return (
    <div>
      <Navbar />
      <div type="list" />
      {loading ? (
        <div className="loadingSpinner">
          <div className="spinner"></div>
          <p>Loading Please Wait</p>
        </div>
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <CloseIcon className="close" onClick={() => setOpen(false)} />
              <ArrowBackIosNewIcon
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <img
                  src={data.photos[slideNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <ArrowForwardIosIcon
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <div className="hotelHeader">
              <h1 className="hotelTitle">{data.name}</h1>
              {data.rating > 0 && (
                <div className="hotelHeaderRating">
                  <span className="ratingScore">{data.rating.toFixed(1)}</span>
                  <div className="ratingStars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.round(data.rating) ? "star filled" : "star"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hotelAddressWrapper">
              <div className="hotelAddress">
                <LocationOnIcon />
                <span>{data.address}</span>
              </div>
            </div>

            <span className="hotelDistance">
              <RoomIcon className="distanceIcon" />
              Excellent location – {data.distance}
            </span>

            <div className="hotelTypeAndStatus">
              <span className="hotelType">{data.type}</span>
              {data.status && (
                <span className={`hotelStatus ${data.status}`}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
              )}
            </div>

            <div className="hotelImages">
              {data.photos?.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>

            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h2 className="hotelDetailTitle">{data.title}</h2>
                <p className="hotelDesc">{data.desc}</p>

                <h2>Amenities</h2>
                <div className="hotelAmenities">
                  {data.amenities?.map((amenity, i) => (
                    <span key={i} className="amenityTag">
                      <span className="amenityIcon">
                        {getAmenityIcon(amenity)}
                      </span>
                      {amenity}
                    </span>
                  ))}
                </div>

                {data.policies && (
                  <div className="hotelPolicies">
                    <h2>Hotel Policies</h2>
                    <div className="policiesGrid">
                      {data.policies.checkIn && (
                        <div className="policyItem">
                          <h3>Check-in</h3>
                          <p>{data.policies.checkIn}</p>
                        </div>
                      )}
                      {data.policies.checkOut && (
                        <div className="policyItem">
                          <h3>Check-out</h3>
                          <p>{data.policies.checkOut}</p>
                        </div>
                      )}
                      {data.policies.cancellation && (
                        <div className="policyItem">
                          <h3>Cancellation</h3>
                          <p>{data.policies.cancellation}</p>
                        </div>
                      )}
                      {data.policies.paymentOptions?.length > 0 && (
                        <div className="policyItem">
                          <h3>Payment Options</h3>
                          <p>{data.policies.paymentOptions.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="hotelReviews">
                  <h2>Guest Reviews</h2>
                  {!data.reviews || data.reviews.length === 0 ? (
                    <div className="noReviews">
                      <p>No Reviews Yet</p>
                    </div>
                  ) : (
                    <div className="reviewsContainer">
                      {data.reviews.slice(0, 4).map((review, i) => (
                        <div key={i} className="reviewItem">
                          <div className="reviewHeader">
                            <div className="reviewRating">
                              {[...Array(5)].map((_, j) => (
                                <span
                                  key={j}
                                  className={
                                    j < review.rating ? "star filled" : "star"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="reviewDate">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="reviewComment">{review.comment}</p>
                        </div>
                      ))}
                      {data.reviews.length > 4 && (
                        <button
                          className="seeMoreReviews"
                          onClick={() => setReviewsModalOpen(true)}
                        >
                          See all {data.reviews.length} reviews
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {data.contact && (
                  <div className="hotelContact">
                    <h2>Contact Information</h2>
                    <div className="contactInfo">
                      {data.contact.email && (
                        <p className="contactItem">
                          <EmailIcon className="contactIcon" />
                          <span>{data.contact.email}</span>
                        </p>
                      )}
                      {data.contact.phone && (
                        <p className="contactItem">
                          <PhoneIcon className="contactIcon" />
                          <span>{data.contact.phone}</span>
                        </p>
                      )}
                      {data.contact.website && (
                        <p className="contactItem">
                          <LanguageIcon className="contactIcon" />
                          <span>{data.contact.website}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <h2>Location</h2>
                <div className="map-container">
                  <iframe
                    title="Hotel Location"
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

              <div className="hotelDetailsPrice">
                <h2>Perfect for a {days}-night stay!</h2>
                <span>
                  Located in the heart of {data.city}, this property has an
                  excellent location!
                </span>

                {/* Date Range and Guest Selection Section */}
                <div className="bookingOptionsContainer">
                  <div className="bookingOption" ref={dateRef}>
                    <div
                      className="bookingOptionInput"
                      onClick={() => setOpenDate(!openDate)}
                    >
                      <CalendarMonthIcon className="bookingOptionIcon" />
                      <span className="bookingOptionText">
                        {dateState[0].startDate && dateState[0].endDate
                          ? `${format(
                              dateState[0].startDate,
                              "MM/dd/yyyy"
                            )} to ${format(dateState[0].endDate, "MM/dd/yyyy")}`
                          : "Select Dates"}
                      </span>
                    </div>
                    {openDate && (
                      <div className="datePickerDropdown">
                        <DateRange
                          editableDateInputs={true}
                          onChange={handleDateChange}
                          moveRangeOnFirstSelection={false}
                          ranges={dateState}
                          minDate={new Date()}
                          className="datePicker"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bookingOption" ref={optionsRef}>
                    <div
                      className="bookingOptionInput"
                      onClick={() => setOpenOptions(!openOptions)}
                    >
                      <PersonIcon className="bookingOptionIcon" />
                      <span className="bookingOptionText">
                        {`${optionsState.adult} ${
                          optionsState.adult === 1 ? "adult" : "adults"
                        } · ${optionsState.children} ${
                          optionsState.children === 1 ? "child" : "children"
                        } · ${optionsState.room} ${
                          optionsState.room === 1 ? "room" : "rooms"
                        }`}
                      </span>
                    </div>
                    {openOptions && (
                      <div className="optionsDropdown">
                        <div className="optionItem">
                          <span className="optionText">Adult</span>
                          <div className="optionCounter">
                            <button
                              disabled={optionsState.adult <= 1}
                              className="optionCounterButton"
                              onClick={() => handleOption("adult", "d")}
                            >
                              -
                            </button>
                            <span className="optionCounterNumber">
                              {optionsState.adult}
                            </span>
                            <button
                              className="optionCounterButton"
                              onClick={() => handleOption("adult", "i")}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="optionItem">
                          <span className="optionText">Children</span>
                          <div className="optionCounter">
                            <button
                              disabled={optionsState.children <= 0}
                              className="optionCounterButton"
                              onClick={() => handleOption("children", "d")}
                            >
                              -
                            </button>
                            <span className="optionCounterNumber">
                              {optionsState.children}
                            </span>
                            <button
                              className="optionCounterButton"
                              onClick={() => handleOption("children", "i")}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="optionItem">
                          <span className="optionText">Room</span>
                          <div className="optionCounter">
                            <button
                              disabled={optionsState.room <= 1}
                              className="optionCounterButton"
                              onClick={() => handleOption("room", "d")}
                            >
                              -
                            </button>
                            <span className="optionCounterNumber">
                              {optionsState.room}
                            </span>
                            <button
                              className="optionCounterButton"
                              onClick={() => handleOption("room", "i")}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button onClick={handleSearch} className="updateSelectionBtn">
                    Update Selection
                  </button>
                </div>

                <div className="priceContainer">
                  <span className="priceLabel">Price Starts at</span>
                  <span className="priceValue">
                    BDT {data.cheapestPrice?.toLocaleString() || "N/A"}
                  </span>
                  <span className="pricePerNight">per night</span>
                </div>
                <div className="totalPriceContainer">
                  <span className="totalPriceLabel">
                    Total for {days} nights:
                  </span>
                  <span className="totalPriceValue">
                    BDT{" "}
                    {(data.cheapestPrice
                      ? data.cheapestPrice * days
                      : 0
                    ).toLocaleString()}
                  </span>
                </div>
                <button
                  className="bookingButton"
                  onClick={handleClick}
                  disabled={!dateState || dateState.length === 0}
                  style={{
                    backgroundColor:
                      !dateState || dateState.length === 0 ? "#ccc" : "#0071c2",
                    cursor:
                      !dateState || dateState.length === 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Reserve or Book Now!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {openModal && (
        <Reserve setOpen={setOpenModal} hotelId={id} days={days} user={user} />
      )}

      {/* Reviews Modal */}
      <Dialog
        open={reviewsModalOpen}
        onClose={() => setReviewsModalOpen(false)}
        aria-labelledby="reviews-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="reviews-dialog-title">
          All Reviews
          <IconButton
            aria-label="close"
            onClick={() => setReviewsModalOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div className="allReviewsContainer">
            {data?.reviews?.map((review, i) => (
              <div key={i} className="reviewItem">
                <div className="reviewHeader">
                  <div className="reviewRating">
                    {[...Array(5)].map((_, j) => (
                      <span
                        key={j}
                        className={j < review.rating ? "star filled" : "star"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="reviewDate">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="reviewComment">{review.comment}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Hotel;
