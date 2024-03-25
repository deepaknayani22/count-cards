import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Card from "./Card";
import ActionButtons from "./ActionButtons";
import "./styles.css";

function BasicStrategy() {
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

  const [deck, setDeck] = useState([]);

  const handleActionSelected = (action) => {
    console.log(`Action selected: ${action}`);
    // Here, you'll implement the logic based on the ruleset you provide later.
  };

  const generateDeck = () => {
    let newDeck = [];
    for (let suit of suits) {
      for (let value of values) {
        newDeck.push({
          id: `${value}_of_${suit}`,
          cardImage: `${value}_of_${suit}`,
        });
      }
    }
    return shuffle(newDeck);
  };

  const shuffle = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const pickRandomCards = (deck, num) => {
    let positions = [
      [0, 3, 0], // First card position
      [-3, -3, 0], // Second card position
      [3, -3, 0], // Third card position
    ];
    return shuffle([...deck])
      .slice(0, num)
      .map((card, index) => ({
        ...card,
        animateToPosition: positions[index],
        flip: true,
      }));
  };

  const dealCards = () => {
    const newDeck = generateDeck();
    const randomCards = pickRandomCards(newDeck, 3);
    setDeck(randomCards);
  };

  useEffect(() => {
    dealCards(); // Initial deal on component mount
  }, []);

  return (
    <div className="basic-strategy-main">
      <div className="header">Learn Card Counting and Basic Strategy</div>
      <p className="header">(refresh page to reset)</p>
      <Canvas camera={{ position: [0, 0, 20], fov: 35 }}>
        <Suspense fallback={null}>
          {deck.map((card) => (
            <Card
              key={card.id}
              animateToPosition={card.animateToPosition}
              flip={card.flip}
              cardImage={card.cardImage}
            />
          ))}
        </Suspense>
      </Canvas>
      <button className="deal-button" onClick={dealCards}>
        Deal
      </button>
      <ActionButtons onActionSelected={handleActionSelected} />
    </div>
  );
}

export default BasicStrategy;
