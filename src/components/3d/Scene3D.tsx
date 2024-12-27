import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { KaraokeBox } from "./KaraokeBox";

export const Scene3D = () => {
  return (
    <div className="w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden">
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[10, 5, 10]} />
          <OrbitControls enableZoom={true} maxDistance={20} minDistance={5} />
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <KaraokeBox />
        </Canvas>
      </Suspense>
    </div>
  );
};