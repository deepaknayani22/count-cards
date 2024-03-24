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

  const [numDecks, setNumDecks] = useState(1); // State for the number of decks
  const [showDropDown, setShowDropDown] = useState(true);

  // Fisher-Yates shuffle algorithm
  const shuffle = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  // Function to generate and shuffle the deck according to the selected number of decks
  const generateDeck = () => {
    let deck = [];
    for (let n = 0; n < numDecks; n++) {
      for (let suit of suits) {
        for (let value of values) {
          deck.push({
            id: `${value}_of_${suit}_${n}`, // Ensure uniqueness across multiple decks
            animateToPosition: [5, 0, 0.02 * deck.length],
            flip: false,
            cardImage: `${value}_of_${suit}`, // Filename without extension
          });
        }
      }
    }
    return shuffle(deck); // Shuffle the combined decks
  };

  const [deck, setDeck] = useState(generateDeck());
  const [discardPile, setDiscardPile] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawCard = useCallback(() => {
    if (deck.length === 0) return;
    const index = deck.length - 1;
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
    if (isDrawing) {
      timer = setInterval(() => {
        drawCard();
      }, 500);
    }

    return () => clearInterval(timer);
  }, [drawCard, isDrawing, deck]);

  // Regenerate the deck whenever numDecks changes
  useEffect(() => {
    setDeck(generateDeck());
  }, [numDecks]);

  const handleStartStopClick = () => {
    setShowDropDown(false);
    setIsDrawing(!isDrawing);
  };

  return (
    <div className="App">
      <div className="header">Learn Card Counting and Basic Strategy</div>
      <p className="header">(refresh page to reset)</p>
      {showDropDown && (
        <select
          value={numDecks}
          onChange={(e) => setNumDecks(Number(e.target.value))}
          className="num-decks-select"
        >
          <option value="1">1 Deck</option>
          <option value="2">2 Decks</option>
          <option value="3">3 Decks</option>
          <option value="4">4 Decks</option>
        </select>
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
      <button className="start-counting-btn" onClick={handleStartStopClick}>
        {isDrawing ? "Stop Counting" : "Start Counting"}
      </button>
    </div>
  );
}

export default App;
