import React, { Suspense, useState, useCallback } from "react";
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

  const drawCard = useCallback(
    (index) => {
      const newDeck = [...deck];
      const cardToMove = {
        ...newDeck[index],
        animateToPosition: [0, 0, 0.02 * discardPile.length],
        flip: true,
      };

      // Step 1: Animate card to the center and initiate the flip sequence
      setDeck((prevDeck) =>
        prevDeck.map((card, i) => (i === index ? cardToMove : card))
      );

      // Step 2: Wait for the card animation to complete before moving it to the discard pile

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
      }, 2000); // This matches the total animation duration in Card
    },
    [deck, discardPile.length]
  );

  return (
    <div className="App">
      <button onClick={() => drawCard(deck.length - 1)}>Draw Card</button>
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
