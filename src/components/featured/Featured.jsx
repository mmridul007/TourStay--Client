import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch.js";
import "./featured.css";

const FeaturedSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityHotels, setCityHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);

  const cities = [
    "Dhaka",
    "Chittagong",
    "Cox's Bazar",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Comilla",
    "Mymensingh",
    "Rangpur",
  ];

  const citiesQueryString = cities.join(",").toLowerCase();

  const { data, loading, error } = useFetch(
    `https://tourstay-server.onrender.com/api/hotels/countByCity?cities=${citiesQueryString}`
  );

  useEffect(() => {
    let interval;
    if (isAutoPlaying && !loading) {
      interval = setInterval(() => {
        nextSlide();
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentIndex, isAutoPlaying, loading]);

  // Calculate how many items to show based on screen width
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= cities.length - (itemsToShow - 1) ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      return nextIndex < 0 ? cities.length - itemsToShow : nextIndex;
    });
  };

  // Pause autoplay when hovering
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // City images
  const cityImages = {
    dhaka:
      "https://media.istockphoto.com/id/1497696859/photo/chittagong-city-skyline-drone-view-of-chittagong-city.jpg?s=612x612&w=0&k=20&c=3LGbUKRY8K3FRMZNgvJNutXW2iVUu7_xa8pxp2N7ItE=",
    chittagong:
      "https://images.unsplash.com/photo-1619713277018-c5499173232c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpdHRhZ29uZ3xlbnwwfHwwfHx8MA%3D%3D",
    "cox's bazar":
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/e2/f8/43/longest-sea-beach-in.jpg?w=1100&h=1100&s=1",
    sylhet:
      "https://media.istockphoto.com/id/1550261852/photo/beautiful-tea-gardens-in-srimongol-sylhet.jpg?s=612x612&w=0&k=20&c=fiEPm28qBRB-PDaSb73AaFTK3NoLu9Kg1cfXHOHXndM=",
    rajshahi:
      "https://thetravelerbd.com/wp-content/uploads/2024/02/Best-Tourist-Place-in-Rajshahi-Division.png",
    khulna:
      "https://upload.wikimedia.org/wikipedia/commons/a/ad/Tiger_Sculpture_in_Khulna.jpg",
    barishal:
      "https://upload.wikimedia.org/wikipedia/commons/c/cc/Floating_market_%2CBarisal.JPG",
    comilla: "https://live.staticflickr.com/4491/24252848858_5987b5b94a_b.jpg",
    mymensingh:
      "https://upload.wikimedia.org/wikipedia/commons/9/90/A_front_view_of_Shashi_Lodge_4.jpg",
    rangpur:
      "https://upload.wikimedia.org/wikipedia/commons/9/98/Rangpur_Town_Hall.jpg",
  };

  // Handle city card click
  const handleCityClick = async (city) => {
    setSelectedCity(city);
    setLoadingHotels(true);

    try {
      const response = await fetch(
        `https://tourstay-server.onrender.com/api/hotels/byCity/${city.toLowerCase()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch hotels");
      }
      const data = await response.json();
      setCityHotels(data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setCityHotels([]);
    } finally {
      setLoadingHotels(false);
    }
  };

  const closeModal = () => {
    setSelectedCity(null);
    setCityHotels([]);
  };

  // Navigate to hotel detail page
  const navigateToHotel = (hotelId) => {
    window.location.href = `/hotels/${hotelId}`;
  };

  return (
    <div className="featuredContainer">
      <div
        className="featuredSlider"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {loading ? (
          <div className="loading">Loading Please Wait!!</div>
        ) : error ? (
          <div className="error">Something went wrong!</div>
        ) : (
          <>
            <div
              className="featuredSliderTrack"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsToShow)
                }%)`,
              }}
            >
              {cities.map((city, index) => (
                <div
                  className="featuredItem"
                  key={index}
                  style={{ flex: `0 0 ${100 / itemsToShow}%` }}
                  onClick={() => handleCityClick(city)}
                >
                  <img
                    src={cityImages[city.toLowerCase()]}
                    alt={city}
                    className="featuredImg"
                  />
                  <div className="featuredTitles">
                    <h1>{city}</h1>
                    <h2>{data && data[index] ? data[index] : 0} properties</h2>
                  </div>
                </div>
              ))}
            </div>

            <div className="sliderControls">
              <button className="sliderControlBtn prevBtn" onClick={prevSlide}>
                &lt;
              </button>
              <button className="sliderControlBtn nextBtn" onClick={nextSlide}>
                &gt;
              </button>
            </div>
          </>
        )}
      </div>

      {/* City Hotels Modal */}
      {selectedCity && (
        <div className="cityHotelModal">
          <div className="modalOverlay" onClick={closeModal}></div>
          <div className="modalContent">
            <div className="modalHeader">
              <h2>Hotels in {selectedCity}</h2>
              <button className="closeModalBtn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modalBody">
              {loadingHotels ? (
                <div className="modalLoading">Loading hotels...</div>
              ) : cityHotels.length > 0 ? (
                <ul className="hotelList">
                  {cityHotels.map((hotel) => (
                    <li
                      key={hotel._id}
                      onClick={() => navigateToHotel(hotel._id)}
                    >
                      <div className="hotelItem">
                        <div className="hotelDetails">
                          <h3>{hotel.name}</h3>
                          <p>{hotel.address}</p>
                        </div>
                        <div className="hotelPrice">
                          <span>From BDT {hotel.cheapestPrice}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="noHotels">
                  No hotels found in {selectedCity}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedSlider;
