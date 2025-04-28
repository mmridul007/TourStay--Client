import React, { useState } from "react";

const DatePicker = (props) => {
  const { actionProvider, payload } = props;
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDateSubmit = () => {
    if (payload && payload.dateType === "checkIn") {
      actionProvider.handleCheckInResponse(selectedDate);
    } else if (payload && payload.dateType === "checkOut") {
      actionProvider.handleCheckOutResponse(selectedDate);
    }
  };

  return (
    <div className="date-picker-container">
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        min={new Date().toISOString().split("T")[0]}
        className="date-input"
      />
      <button
        onClick={handleDateSubmit}
        className="date-submit-button"
        disabled={!selectedDate}
      >
        Confirm Date
      </button>
    </div>
  );
};

export default DatePicker;
