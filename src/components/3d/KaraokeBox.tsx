import { Text } from "@react-three/drei";

export const KaraokeBox = () => {
  return (
    <group>
      {/* Main room structure */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 4, 6]} />
        <meshStandardMaterial color="#f3f4f6" opacity={0.8} transparent />
      </mesh>
      
      {/* Screen */}
      <mesh position={[0, 0.5, -2.9]}>
        <boxGeometry args={[4, 2, 0.1]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Seating area */}
      <mesh position={[0, -1.5, 1]}>
        <boxGeometry args={[6, 0.5, 2]} />
        <meshStandardMaterial color="#7E3AED" />
      </mesh>

      {/* Labels */}
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