import React, { useRef, useState, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { animated, useSpring } from "@react-spring/three";
import backface from "./assets/backfacing.png"; // Keep this for the back of the card

const Card = ({ animateToPosition, flip, cardImage }) => {
  const cardRef = useRef();

  // Use require to dynamically load the card's front texture
  // You might need to adjust the path depending on your project structure
  const textureFront = useLoader(
    TextureLoader,
    require(`./assets/cards/${cardImage}.png`)
  );
  // Load the backface texture (static, as before)
  const textureBack = useLoader(TextureLoader, backface);

  const [isPaused, setIsPaused] = useState(false);

  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0], // Initial position
    config: { mass: 0.25, tension: 150, friction: 10 },
  }));

  useFrame(() => {
    const currentPosition = cardRef.current.position.x;
    if (currentPosition === 0 && !isPaused) {
      setIsPaused(true);
      setTimeout(() => {
        setIsPaused(false);
        api.start({ position: animateToPosition });
      }, 2000); // Pause for 2 seconds
    }
  });

  useEffect(() => {
    if (!isPaused) {
      api.start({ position: animateToPosition });
    }
  }, [animateToPosition, isPaused, api]);

  return (
    <animated.mesh position={spring.position} ref={cardRef}>
      <boxGeometry args={[3, 3.6, 0.03]} />
      <meshBasicMaterial map={flip ? textureFront : textureBack} />
    </animated.mesh>
  );
};

export default Card;
