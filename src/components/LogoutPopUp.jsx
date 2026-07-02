import React from "react";
import "./style.css";

const LogoutPopUp = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out of your session?</p>

        <div className="popup-actions">
          <button
            className="action-btn secondary-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="action-btn danger-btn"
            onClick={onConfirm}
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopUp;