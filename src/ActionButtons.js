import React from "react";
import "./styles.css";

function ActionButtons({
  options,
  onActionSelected,
  selectedAction,
  isActionCorrect,
  correctOption,
  disabled,
}) {
  const getButtonStyle = (option) => {
    if (selectedAction && selectedAction === option) {
      return {
        backgroundColor: isActionCorrect ? "green" : "red",
        color: "white",
      };
    } else if (selectedAction && !isActionCorrect && correctOption === option) {
      // This condition highlights the correct option green only after a wrong selection.
      return { backgroundColor: "green", color: "white" };
    }
    // Default style, applies when no action has been selected yet.
    return { backgroundColor: "#0074d9", color: "white" };
  };

  return (
    <div className="action-buttons">
      {options.map((option) => (
        <button
          disabled={disabled}
          key={option}
          onClick={() => onActionSelected(option)}
          style={getButtonStyle(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default ActionButtons;
