import React, { Suspense, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Card from "./Card";
import "./styles.css";

function App() {
  const [deck, setDeck] = useState(
    new Array(52).fill(null).map((_, index) => ({
      id: index,
      animateToPosition: [5, 0, 0.02 * index],
      flip: false,
    }))
  );
  const [discardPile, setDiscardPile] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false); // Controls if we are drawing cards
  const [isPaused, setIsPaused] = useState(false); // Controls if the drawing is paused

  const drawCard = useCallback(() => {
    if (deck.length === 0) return;
    const index = deck.length - 1; // Always draw the last card
    const newDeck = [...deck];
    const cardToMove = {
      ...newDeck[index],
      animateToPosition: [0, 0, 0.02 * discardPile.length],
      flip: true,
    };

    setDeck((prevDeck) =>
      prevDeck.map((card, i) => (i === index ? cardToMove : card))
    );

    setTimeout(() => {
      setDiscardPile((prevDiscardPile) => [
        ...prevDiscardPile,
        {
          ...cardToMove,
          animateToPosition: [-5, 0, 0.02 * prevDiscardPile.length],
          flip: false,
        },
      ]);
      setDeck((prevDeck) => prevDeck.filter((_, i) => i !== index));
    }, 250);
  }, [deck, discardPile.length]);

  useEffect(() => {
    let timer;
    if (isDrawing && !isPaused) {
      timer = setInterval(() => {
        drawCard();
      }, 500); // Trigger every second
    }

    return () => clearInterval(timer);
  }, [drawCard, isDrawing, isPaused, deck]);

  const handleStartStopClick = () => {
    setIsDrawing(!isDrawing);
  };

  const handlePauseResumeClick = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="App">
      <button onClick={handleStartStopClick}>
        {isDrawing ? "Stop Drawing" : "Start Drawing"}
      </button>
      {isDrawing && (
        <button onClick={handlePauseResumeClick}>
          {isPaused ? "Resume" : "Pause"}
        </button>
      )}
      <Canvas camera={{ position: [0, 0, 20], fov: 30 }}>
        <Suspense fallback={null}>
          {deck.map((card, index) => (
            <Card
              key={`deck-${card.id}`}
              animateToPosition={card.animateToPosition}
              flip={card.flip}
            />
          ))}
          {discardPile.map((card, index) => (
            <Card
              key={`discard-${index}`}
              animateToPosition={card.animateToPosition}
              flip={card.flip}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
