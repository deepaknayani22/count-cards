import React, { useRef, useState, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { animated, useSpring } from "@react-spring/three";
import placeholder from "./assets/placeholder.png";
import backface from "./assets/backfacing.png";

const Card = ({ animateToPosition, flip }) => {
  const cardRef = useRef();
  const textureFront = useLoader(TextureLoader, placeholder);
  const textureBack = useLoader(TextureLoader, backface);
  const [isPaused, setIsPaused] = useState(false);

  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0], // Assuming initial position
    config: { mass: 0.25, tension: 150, friction: 10 },
  }));

  // Logic to pause at x = 0
  useFrame(() => {
    const currentPosition = cardRef.current.position.x;
    if (currentPosition === 0 && !isPaused) {
      setIsPaused(true);
      setTimeout(() => {
        setIsPaused(false);
        // Resume animation by updating the position to the target
        api.start({ position: animateToPosition });
      }, 2000); // Pause for 2 seconds
    }
  });

  // Automatically update the position when not paused and animateToPosition changes
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
