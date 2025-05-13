import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch.js";
import "./propertyList.css";

const PropertyList = () => {
  const { data, loading, error } = useFetch(
    "https://tourstay-server.onrender.com/api/hotels/countByType"
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [hotelsOfType, setHotelsOfType] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const navigate = useNavigate();

  // Check if the screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const images = [
    "https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o=",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg",
  ];

  const nextSlide = () => {
    if (data && data.length > 0) {
      const maxSlide = Math.ceil(data.length / 2) - 1;
      setCurrentSlide(currentSlide === maxSlide ? 0 : currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (data && data.length > 0) {
      const maxSlide = Math.ceil(data.length / 2) - 1;
      setCurrentSlide(currentSlide === 0 ? maxSlide : currentSlide - 1);
    }
  };

  useEffect(() => {
    if (sliderRef.current && isMobile) {
      sliderRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide, isMobile]);

  // Fetch hotels of a specific type when a card is clicked
  const fetchHotelsByType = async (type) => {
    setLoadingHotels(true);
    try {
      // Use the singular form of the type for API call
      const singularType = type.endsWith("s") ? type.slice(0, -1) : type;

      const response = await fetch(
        `https://tourstay-server.onrender.com/api/hotels/getHotelByType?type=${singularType}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setHotelsOfType(data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setHotelsOfType([]);
    } finally {
      setLoadingHotels(false);
    }
  };

  const handleCardClick = (type) => {
    setSelectedType(type);
    fetchHotelsByType(type);
    setShowModal(true);
  };

  const handleHotelClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedType(null);
    setHotelsOfType([]);
  };

  return (
    <div className="pListContainer">
      <div className="pList">
        {loading ? (
          <div className="loadingMessage">Loading Please Wait!!</div>
        ) : error ? (
          <div className="errorMessage">Error loading property types!</div>
        ) : (
          <>
            <div ref={sliderRef} className="pListSlider">
              {data &&
                data.length > 0 &&
                data.map((item, i) => (
                  <div
                    key={i}
                    className="pListItem"
                    onClick={() => handleCardClick(item.type)}
                  >
                    <img
                      src={images[i] || images[0]}
                      alt={item.type}
                      className="pListImg"
                    />
                    <div className="pListTitles">
                      <h1>{item.type}</h1>
                      <h2>
                        {item.count} {item.type}
                      </h2>
                    </div>
                  </div>
                ))}
            </div>
            {isMobile && data && data.length > 2 && (
              <div className="sliderControls">
                <button onClick={prevSlide} className="sliderBtn prevBtn">
                  &lt;
                </button>
                <button onClick={nextSlide} className="sliderBtn nextBtn">
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for displaying hotels of selected type */}
      {showModal && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>{selectedType}</h2>
              <button className="closeBtn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modalBody">
              {loadingHotels ? (
                <div className="loadingMessage">Loading hotels...</div>
              ) : hotelsOfType.length === 0 ? (
                <div className="noHotelsMessage">
                  No {selectedType} available at the moment.
                </div>
              ) : (
                <div className="hotelsList">
                  {hotelsOfType.map((hotel) => (
                    <div key={hotel._id} className="hotelCard">
                      <div className="hotelInfo">
                        <h3
                          className="hotelName"
                          onClick={() => handleHotelClick(hotel._id)}
                        >
                          {hotel.name}
                        </h3>
                        <p className="hotelCity">{hotel.city}</p>
                        <p className="hotelPrice">
                          Starting from BDT {hotel.cheapestPrice}
                        </p>
                        {/* {hotel.rating && (
                          <div className="hotelRating">
                            <span className="ratingScore">{hotel.rating}</span>
                            <span className="ratingText">
                              {hotel.rating >= 4.5
                                ? "Excellent"
                                : hotel.rating >= 4
                                ? "Very Good"
                                : hotel.rating >= 3.5
                                ? "Good"
                                : "Average"}
                            </span>
                          </div>
                        )} */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
