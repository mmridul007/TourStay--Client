import React, { useState } from "react";

const GuestCounter = (props) => {
  const { actionProvider, payload } = props;
  const [count, setCount] = useState(
    payload && payload.guestType === "adults" ? 2 : 0
  );

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    if (count > (payload && payload.guestType === "adults" ? 1 : 0)) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  const handleSubmit = () => {
    if (payload && payload.guestType === "adults") {
      actionProvider.handleAdultsResponse(count.toString());
    } else if (payload && payload.guestType === "children") {
      actionProvider.handleChildrenResponse(count.toString());
    }
  };

  return (
    <div className="guest-counter-container">
      <div className="counter-controls">
        <button
          onClick={handleDecrement}
          className="counter-button"
          disabled={
            count <= (payload && payload.guestType === "adults" ? 1 : 0)
          }
        >
          -
        </button>
        <span className="guest-count">{count}</span>
        <button onClick={handleIncrement} className="counter-button">
          +
        </button>
      </div>
      <button onClick={handleSubmit} className="guest-submit-button">
        Confirm
      </button>
    </div>
  );
};

export default GuestCounter;
