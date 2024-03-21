import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Card from "./Card";
import "./styles.css";

function App() {
  // Adjust deck initialization to include rotation for tilting forward
  const [deck, setDeck] = useState(
    new Array(52).fill(null).map((_, index) => ({
      position: [5, 0, 0.02 * index], // Adjust z position based on index to create thickness
      rotation: [-Math.PI / 4, 0, 0], // Tilt forward by 45 degrees
      flip: false,
    }))
  );
  const [discardPile, setDiscardPile] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const drawCard = () => {
    if (deck.length === 0 || selectedCard) return;

    const [drawnCard, ...newDeck] = deck; // Extract the top card and the rest of the deck
    setDeck(newDeck);

    setSelectedCard({
      ...drawnCard,
      position: [0, 0, 0], // Position for the drawn card to move to
      rotation: [0, 0, 0],
      flip: true,
    });

    setTimeout(() => {
      setDiscardPile([
        ...discardPile,
        { ...drawnCard, position: [-5, 0, -0.02 * discardPile.length] },
      ]); // Add to discard pile
      setSelectedCard(null);
    }, 100); // Adjust timeout as needed
  };

  return (
    <div className="App">
      <Canvas camera={{ position: [0, 0, 20], fov: 30 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} />
        <Suspense fallback={null}>
          {deck.map((card, index) => (
            <Card
              key={`deck-${index}`}
              position={card.position}
              rotation={card.rotation} // Apply the tilt to each card
              onClick={drawCard}
              flip={card.flip}
            />
          ))}
          {selectedCard && (
            <Card
              position={selectedCard.position}
              rotation={selectedCard.rotation}
              flip={selectedCard.flip}
              onClick={() => {}}
            />
          )}
          {discardPile.map((card, index) => (
            <Card
              key={`discard-${index}`}
              position={card.position}
              rotation={card.rotation} // Tilt forward for consistency
              flip={card.flip}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
