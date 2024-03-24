import React, { Suspense, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Card from "./Card";
import "./styles.css";

function App() {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const values = [
    "ace",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "jack",
    "queen",
    "king",
  ];

  // Fisher-Yates shuffle algorithm
  const shuffle = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  // Function to generate and shuffle the deck
  const generateDeck = () => {
    const deck = [];
    for (let suit of suits) {
      for (let value of values) {
        deck.push({
          id: `${value}_of_${suit}`,
          animateToPosition: [5, 0, 0.02 * deck.length], // Adjust as needed
          flip: false,
          cardImage: `${value}_of_${suit}`, // Filename without extension
        });
      }
    }
    return shuffle(deck); // Shuffle the deck once
  };

  const [deck, setDeck] = useState(generateDeck());
  const [discardPile, setDiscardPile] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
      }, 500); // Trigger every 500ms
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
              cardImage={card.cardImage}
            />
          ))}
          {discardPile.map((card, index) => (
            <Card
              key={`discard-${index}`}
              animateToPosition={card.animateToPosition}
              flip={card.flip}
              cardImage={card.cardImage}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
