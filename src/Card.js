import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useSpring, animated } from "@react-spring/three";
import placeholder from "./assets/placeholder.png"; // Ensure this path is correct
import backface from "./assets/backfacing.png"; // Ensure this path is correct

const Card = ({
  animateToPosition = [5, 0, 0], // Default position, can be overridden
  flip,
  onClick,
}) => {
  console.log("Card");
  const textureFront = useLoader(TextureLoader, placeholder);
  const textureBack = useLoader(TextureLoader, backface);

  // Spring for moving the card to the specified position
  const { position } = useSpring({
    position: animateToPosition,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <animated.mesh position={position} onClick={onClick}>
      <boxGeometry args={[3, 3.6, 0.03]} />
      <animated.meshBasicMaterial map={flip ? textureFront : textureBack} />
    </animated.mesh>
  );
};

export default Card;
