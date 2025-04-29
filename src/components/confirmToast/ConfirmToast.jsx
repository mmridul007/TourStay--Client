import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./confirmToast.css"; // Custom styles

export function showConfirmToast({ message, onConfirm, onCancel }) {
  const toastId = toast(
    ({ closeToast }) => (
      <div className="confirm-toast">
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          <button
            className="cancel-button"
            onClick={() => {
              onCancel();
              toast.dismiss(toastId);
            }}
          >
            Cancel
          </button>
          <button
            className="confirm-button"
            onClick={() => {
              onConfirm();
              toast.dismiss(toastId);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      position: toast.POSITION.TOP_CENTER,
      toastClassName: "confirm-toast-container",
    }
  );
}
