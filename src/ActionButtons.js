import React from "react";
import "./styles.css";

function ActionButtons({ options, onActionSelected }) {
  return (
    <div className="action-buttons">
      {options.map((option) => (
        <button key={option} onClick={() => onActionSelected(option)}>
          {option}
        </button>
      ))}
    </div>
  );
}

export default ActionButtons;
