import React, { useRef, useState, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { animated, useSpring } from "@react-spring/three";
import placeholder from "./assets/placeholder.png";
import backface from "./assets/backfacing.png";

const Card = ({ animateToPosition, height }) => {
  const cardRef = useRef();
  const textureFront = useLoader(TextureLoader, placeholder);
  const textureBack = useLoader(TextureLoader, backface);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flip, setFlip] = useState(false); // State to manage card face visibility

  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0], // Assuming initial position
    rotation: [0, 0, 0], // Rotation for flipping
    config: { mass: 1, tension: 150, friction: 24 },
  }));

  useFrame(() => {
    const currentPosition = cardRef.current.position.x;
    // Check if the card is at the center and not currently flipping
    if (currentPosition === 0 && !isFlipping) {
      setIsFlipping(true);

      // Start flipping to show face up
      api.start({ rotation: [0, Math.PI, 0] });
      setFlip(true); // Show the face of the card when it reaches x = 0
      // Wait for the flip animation to show the face up, then schedule the flip back after 2 seconds
      setTimeout(() => {
        setFlip(false); // Prepare to hide the face of the card

        // Flip back to face down
        api.start({ rotation: [0, 0, 0] });

        // After flipping back, schedule the movement to x = -5
        setTimeout(() => {
          api.start({ position: [-5, 0, 0.02 * height] });
          setIsFlipping(false); // Mark the flipping as complete
        }, 500); // Adjust this delay based on your flip animation speed
      }, 1000); // Time to display the face up before flipping back
    }
  });

  useEffect(() => {
    if (!isFlipping) {
      api.start({ position: animateToPosition });
    }
  }, [animateToPosition, isFlipping, api]);

  return (
    <animated.mesh
      position={spring.position}
      rotation={spring.rotation}
      ref={cardRef}
    >
      <boxGeometry args={[3, 3.6, 0.03]} />
      <meshBasicMaterial map={flip ? textureFront : textureBack} />
    </animated.mesh>
  );
};

export default Card;
