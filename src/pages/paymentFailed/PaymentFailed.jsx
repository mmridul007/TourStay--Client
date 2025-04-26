import React from "react";
import { useSearchParams } from "react-router-dom";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="payment-failed-page">
      <h1>Payment Failed</h1>
      {reason && <p className="error-message">Reason: {reason}</p>}
      <button onClick={() => (window.location.href = "/")}>Try Again</button>
      <button onClick={() => (window.location.href = "/contact")}>
        Contact Support
      </button>
    </div>
  );
};

export default PaymentFailed;
