import React, { useRef } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { animated, useSpring } from "@react-spring/three";
import placeholder from "./assets/placeholder.png";
import backface from "./assets/backfacing.png";

const Card = ({ position, rotation = [0, 0, 0], onClick, flip }) => {
  const cardRef = useRef();
  const textureFront = useLoader(TextureLoader, placeholder);
  const textureBack = useLoader(TextureLoader, backface);

  // Use spring for the flip animation, integrating the provided Y rotation
  // The rotation prop is destructured to separate x, y (used for flip), and z rotations
  const [initialXRotation, , initialZRotation] = rotation;
  const { rotationY } = useSpring({
    rotationY: flip ? 0 : Math.PI, // Flip to show the front (0) or back (Math.PI)
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <animated.mesh
      position={position}
      rotation-x={initialXRotation}
      rotation-y={rotationY}
      rotation-z={initialZRotation}
      ref={cardRef}
      onClick={onClick}
    >
      <boxGeometry args={[3, 3.6, 0.03]} />
      <meshBasicMaterial map={flip ? textureFront : textureBack} />
    </animated.mesh>
  );
};

export default Card;
