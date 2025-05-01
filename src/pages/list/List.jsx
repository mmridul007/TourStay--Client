import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  const [min, setMin] = useState("100"); // Start as empty string
  const [max, setMax] = useState("100000");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Convert min and max to numbers safely
  const minPrice = min ? Number(min) : 100;
  const maxPrice = max ? Number(max) : 100000;

  const { data, loading, error, reFetch } = useFetch(
    `https://tourstay-server.onrender.com/api/hotels?city=${destination}&min=${minPrice}&max=${maxPrice}`
  );

  useEffect(() => {
    reFetch();
  }, [destination, minPrice, maxPrice]); // Trigger reFetch when filters change

  const handleClick = () => {
    reFetch();
  };

  // Check if the viewport is mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkIfMobile();

    // Set up event listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Toggle the showMoreFilters state
  const toggleMoreFilters = () => {
    setShowMoreFilters(!showMoreFilters);
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>

            {isMobile ? (
              // Mobile view with collapsible search
              <div className="mobileSearchContainer">
                {/* Always visible search elements */}
                <div className="mobileSearchHeader">
                  <div className="mobileDestination lsItem destinationField">
                    <label>Destination</label>
                    <input
                      placeholder={destination}
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      type="text"
                    />
                  </div>
                  <button onClick={handleClick} className="mobileSearchBtn">
                    Search
                  </button>
                </div>

                {/* Toggle button for more filters */}
                <button className="toggleSearchBtn" onClick={toggleMoreFilters}>
                  {showMoreFilters ? "Hide filters" : "Show more filters"}
                  <span className={`icon ${showMoreFilters ? "open" : ""}`}>
                    ▼
                  </span>
                </button>

                {/* Collapsible search elements */}
                <div
                  className={`searchCollapseContainer ${
                    showMoreFilters ? "open" : "closed"
                  }`}
                >
                  <div className="lsItem">
                    <label>Check-in Date</label>
                    <span onClick={() => setOpenDate(!openDate)}>
                      {dates?.[0]
                        ? `${format(
                            dates[0].startDate,
                            "MM/dd/yyyy"
                          )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`
                        : "Select dates"}
                    </span>
                    {openDate && (
                      <DateRange
                        onChange={(item) => setDates([item.selection])}
                        minDate={new Date()}
                        ranges={dates}
                      />
                    )}
                  </div>
                  <div className="lsItem">
                    <label>Options</label>
                    <div className="lsOptions">
                      <div className="lsOptionItem">
                        <span className="lsOptionText">
                          Min price <small>per night</small>
                        </span>
                        <input
                          type="number"
                          value={min}
                          onChange={(e) => setMin(e.target.value)}
                          className="lsOptionInput"
                          placeholder="100" // new placeholder
                        />
                      </div>
                      <div className="lsOptionItem">
                        <span className="lsOptionText">
                          Max price <small>per night</small>
                        </span>
                        <input
                          type="number"
                          value={max}
                          onChange={(e) => setMax(e.target.value)}
                          className="lsOptionInput"
                          placeholder="100000" // new placeholder
                        />
                      </div>
                      <div className="lsOptionItem">
                        <span className="lsOptionText">Adult</span>
                        <input
                          type="number"
                          min={1}
                          className="lsOptionInput"
                          placeholder={options.adult}
                        />
                      </div>
                      <div className="lsOptionItem">
                        <span className="lsOptionText">Children</span>
                        <input
                          type="number"
                          min={0}
                          className="lsOptionInput"
                          placeholder={options.children}
                        />
                      </div>
                      <div className="lsOptionItem">
                        <span className="lsOptionText">Room</span>
                        <input
                          type="number"
                          min={1}
                          className="lsOptionInput"
                          placeholder={options.room}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Desktop view - regular search
              <>
                <div className="lsItem">
                  <label>Destination</label>
                  <input
                    placeholder={destination}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    type="text"
                  />
                </div>
                <div className="lsItem">
                  <label>Check-in Date</label>
                  <span onClick={() => setOpenDate(!openDate)}>
                    {dates?.[0]
                      ? `${format(
                          dates[0].startDate,
                          "MM/dd/yyyy"
                        )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`
                      : "Select dates"}
                  </span>
                  {openDate && (
                    <DateRange
                      onChange={(item) => setDates([item.selection])}
                      minDate={new Date()}
                      ranges={dates}
                    />
                  )}
                </div>
                <div className="lsItem">
                  <label>Options</label>
                  <div className="lsOptions">
                    <div className="lsOptionItem">
                      <span className="lsOptionText">
                        Min price <small>per night</small>
                      </span>
                      <input
                        type="number"
                        value={min}
                        onChange={(e) => setMin(e.target.value)}
                        className="lsOptionInput"
                        placeholder="100" // new placeholder
                      />
                    </div>
                    <div className="lsOptionItem">
                      <span className="lsOptionText">
                        Max price <small>per night</small>
                      </span>
                      <input
                        type="number"
                        value={max}
                        onChange={(e) => setMax(e.target.value)}
                        className="lsOptionInput"
                        placeholder="100000" // new placeholder
                      />
                    </div>
                    <div className="lsOptionItem">
                      <span className="lsOptionText">Adult</span>
                      <input
                        type="number"
                        min={1}
                        className="lsOptionInput"
                        placeholder={options.adult}
                      />
                    </div>
                    <div className="lsOptionItem">
                      <span className="lsOptionText">Children</span>
                      <input
                        type="number"
                        min={0}
                        className="lsOptionInput"
                        placeholder={options.children}
                      />
                    </div>
                    <div className="lsOptionItem">
                      <span className="lsOptionText">Room</span>
                      <input
                        type="number"
                        min={1}
                        className="lsOptionInput"
                        placeholder={options.room}
                      />
                    </div>
                  </div>
                </div>
                <button onClick={handleClick}>Search</button>
              </>
            )}
          </div>
          <div className="listResult">
            {loading ? (
              "Loading Please Wait!!"
            ) : (
              <>
                {data.map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
