import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CardCounter from "./CardCounter";
import BasicStrategy from "./BasicStrategy";
import "./styles.css";

// Placeholder component for Basic Strategy

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Welcome to the Black Jack ♠️ Trainer ♥️</h1>
                <div className="home-buttons">
                  <Link to="/count-cards">
                    <button>Count Cards</button>
                  </Link>
                  <Link to="/basic-strategy">
                    <button>Basic Strategy</button>
                  </Link>
                </div>
              </div>
            }
          />
          <Route path="/count-cards" element={<CardCounter />} />
          <Route path="/basic-strategy" element={<BasicStrategy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
