import React, { useRef, useState, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { animated, useSpring } from "@react-spring/three";
import backface from "./assets/backfacing.png";

const Card = ({ animateToPosition, flip, cardImage }) => {
  const cardRef = useRef();

  const textureFront = useLoader(
    TextureLoader,
    require(`./assets/cards/${cardImage}.png`)
  );

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
      }, 2000);
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
