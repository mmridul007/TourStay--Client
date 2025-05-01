import { useState, useEffect, useRef } from "react";
import useFetch from "../../hooks/useFetch.js";
import "./featuredProperties.css";

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch(
    "https://tourstay-server.onrender.com/api/hotels/featuredHotel?featured=true&limit=14"
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);
  const autoSlideRef = useRef(null);

  // Handle window resize to update visible cards
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(4);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 480) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1); // Ensure exactly 1 card for small mobile
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!data || data.length <= visibleCards || isPaused) {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
        autoSlideRef.current = null;
      }
      return;
    }

    const startAutoSlide = () => {
      autoSlideRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = data.length - visibleCards;
          const newIndex = prevIndex + 1;

          // If reached the end, go back to first slide
          if (newIndex > maxIndex) {
            return 0;
          }
          return newIndex;
        });
      }, 3000); // Slide every 3 seconds
    };

    startAutoSlide();

    // Clear interval on unmount
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [data, visibleCards, isPaused]);

  // Reset auto-slide timer when manually navigating
  const resetAutoSlideTimer = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);

      if (!isPaused) {
        autoSlideRef.current = setInterval(() => {
          setCurrentIndex((prevIndex) => {
            const maxIndex = data ? data.length - visibleCards : 0;
            const newIndex = prevIndex + 1;

            if (newIndex > maxIndex) {
              return 0;
            }
            return newIndex;
          });
        }, 3000);
      }
    }
  };

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex < 0 ? 0 : newIndex;
    });
    resetAutoSlideTimer();
  };

  // Navigate to next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = data ? data.length - visibleCards : 0;
      const newIndex = prevIndex + 1;
      return newIndex > maxIndex ? maxIndex : newIndex;
    });
    resetAutoSlideTimer();
  };

  // Check if navigation buttons should be disabled
  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = data && currentIndex >= data.length - visibleCards;

  // Handle mouse enter and leave for pausing/resuming auto-slide
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Calculate transform value for smooth sliding
  const getTransformValue = () => {
    if (!data || !sliderRef.current) return "translateX(0)";

    const itemWidth = sliderRef.current.offsetWidth / visibleCards;
    return `translateX(-${currentIndex * itemWidth}px)`;
  };

  return (
    <div className="fpContainer">
      <div
        className="fpWrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        <div
          className="fp"
          ref={sliderRef}
          style={{ transform: getTransformValue() }}
        >
          {loading ? (
            <div className="fpLoading">Loading Please Wait!!</div>
          ) : (
            <>
              {data &&
                data.map((item) => (
                  <div key={item._id} className="fpItem">
                    <img
                      src={item.photos[0]}
                      alt=""
                      className="fpImg"
                    />
                    <span className="fpName">{item.name}</span>
                    <span className="fpCity">Location: <span className="cityName">{item.city}</span></span>
                    <span className="fpPrice">
                      Starting from <span className="price">{item.cheapestPrice}</span> Taka
                    </span>
                    <div className="fpRating">
                      <button>{item.rating}</button>
                      <span>Excellent</span>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>

      <div className="fpSliderControls">
        <button
          className={`fpNavButton ${isPrevDisabled ? "disabled" : ""}`}
          onClick={prevSlide}
          disabled={isPrevDisabled}
        >
          &lt;
        </button>
        <button
          className={`fpNavButton ${isNextDisabled ? "disabled" : ""}`}
          onClick={nextSlide}
          disabled={isNextDisabled}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default FeaturedProperties;
