import "./styles.css";

function ActionButtons({ onActionSelected }) {
  const actions = ["Hit", "Stand", "Double", "Split", "Blackjack"];

  return (
    <div className="action-buttons">
      {actions.map((action) => (
        <button key={action} onClick={() => onActionSelected(action)}>
          {action}
        </button>
      ))}
    </div>
  );
}

export default ActionButtons;
