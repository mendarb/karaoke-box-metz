import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const KaraokeBox = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main room structure */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 4, 6]} />
        <meshPhongMaterial color="#f3f4f6" />
      </mesh>
      
      {/* Screen */}
      <mesh position={[0, 0.5, -2.9]}>
        <boxGeometry args={[4, 2, 0.1]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
      
      {/* Seating area */}
      <mesh position={[0, -1.5, 1]}>
        <boxGeometry args={[6, 0.5, 2]} />
        <meshPhongMaterial color="#7E3AED" />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.5}
        color="#7E3AED"
      >
        K.Box Metz
      </Text>
    </group>
  );
};