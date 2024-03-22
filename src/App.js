import React, { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Card from "./Card";
import "./styles.css";

function App() {
  //INITIALIZING DECK
  console.log("App");
  const [deck, setDeck] = useState(
    new Array(52).fill(null).map((_, index) => ({
      id: index,
      animateToPosition: [5, 0, 0.02 * index], // Starts on the right
      flip: false,
    }))
  );

  // const [deck, setDeck] = useState([
  //   { id: 0, animateToPosition: [5, 0, 0], flip: false },
  //   { id: 1, animateToPosition: [5, 0, 0.02], flip: false },
  //   { id: 2, animateToPosition: [5, 0, 0.04], flip: false },
  //   { id: 3, animateToPosition: [5, 0, 0.06], flip: false },
  // ]);

  const [discardPile, setDiscardPile] = useState([]);

  const drawCard = (index) => {
    // Step 1: Move to the middle and flip
    console.log("OnClick");

    let newDeck = [...deck];
    console.log(newDeck);
    newDeck[index] = {
      ...newDeck[index],
      animateToPosition: [0, 0, 0], // Move to the center
      flip: true, // Flip to show the face
    };
    setDeck(newDeck);

    // Step 2: After 2 seconds, flip back and move to the discard pile
    setTimeout(() => {
      const discardPosition = [-5, 0, 0.02 * discardPile.length]; // Position in the discard pile
      const cardToDiscard = {
        animateToPosition: discardPosition,
        flip: false,
      }; // Flip back and set new position

      // Remove the card from the deck immediately to avoid re-animation
      const updatedDeck = newDeck.filter((_, cardIndex) => cardIndex !== index);

      // Update the discard pile and the deck
      setDiscardPile((currentDiscardPile) => [
        ...currentDiscardPile,
        cardToDiscard,
      ]);
      setDeck(updatedDeck);
    }, 1000);
  };

  return (
    <div className="App">
      <Canvas camera={{ position: [0, 0, 20], fov: 30 }}>
        <Suspense fallback={null}>
          {deck.map((card, index) => (
            <Card
              key={`deck-${card.id}`}
              animateToPosition={card.animateToPosition}
              flip={card.flip}
              onClick={() => drawCard(index)}
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
