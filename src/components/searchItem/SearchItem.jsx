import { Link } from "react-router-dom";
import "./searchItem.css";

const SearchItem = ({ item }) => {
  // Handle possible undefined values safely
  const handleImageError = (e) => {
    // e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
  };

  return (
    <div className="searchItem">
      {/* Hotel Image */}
      <img
        src={
          item.photos && item.photos.length > 0
            ? item.photos[0]
            : "https://via.placeholder.com/200x200?text=No+Image"
        }
        alt={item.name || "Hotel"}
        className="siImg"
        onError={handleImageError}
      />

      {/* Hotel Description */}
      <div className="siDesc">
        <h1 className="siTitle">{item.name || "Unnamed Hotel"}</h1>
        <span className="siDistance">
          {item.distance || "Distance not specified"}
        </span>

        {/* Display room type or hotel type */}
        <span className="siSubtitle">
          {item.type || "Hotel"}{" "}
          {item.bookingType === "Hotels" ? "with amenities" : ""}
        </span>

        {/* Display hotel description with overflow handled by CSS */}
        <span className="siFeatures">
          {item.desc || "No description available"}
        </span>

        {/* Show cancellation policy if available */}
        {(item.policies?.cancellation ||
          item.policies?.cancellation !== "No") && (
          <>
            <span className="siCancelOp">Easy cancellation</span>
            <span className="siCancelOpSubtitle">
              You can cancel later, so lock in this great price today!
            </span>
          </>
        )}

        {/* Display amenities as additional features if available */}
        {item.amenities && item.amenities.length > 0 && (
          <div className="siAmenities">
            {item.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="siAmenity">
                {amenity}
              </span>
            ))}
            {item.amenities.length > 3 && (
              <span className="siAmenity">
                +{item.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hotel Details & Pricing */}
      <div className="siDetails">
        <div className="siRating">
          {/* Show rating text based on the rating value */}
          <span>
            {item.rating >= 4.5
              ? "Excellent"
              : item.rating >= 4
              ? "Very Good"
              : item.rating >= 3
              ? "Good"
              : item.rating >= 2
              ? "Fair"
              : "Poor"}
          </span>
          <button>{item.rating || "N/A"}</button>
        </div>

        <div className="siDetailTexts">
          <span>Price starts form</span>
          <span className="siPrice">BDT {item.cheapestPrice || "N/A"}</span>
          <span className="siTaxOp">Includes taxes and fees</span>

          {/* Link to hotel details page using the hotel ID */}
          <Link to={`/hotels/${item._id}`}>
            <button className="siCheckButton">See availability</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
