import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Box, Text } from "@react-three/drei";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Navbar } from "@/components/navigation/Navbar";

const KaraokeBox = () => {
  return (
    <group>
      {/* Main room structure */}
      <Box args={[8, 4, 6]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f3f4f6" transparent opacity={0.8} />
      </Box>
      
      {/* Screen */}
      <Box args={[4, 2, 0.1]} position={[0, 0.5, -2.9]}>
        <meshStandardMaterial color="#000000" />
      </Box>
      
      {/* Seating area */}
      <Box args={[6, 0.5, 2]} position={[0, -1.5, 1]}>
        <meshStandardMaterial color="#7E3AED" />
      </Box>

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

const Box3D = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onShowAuth={() => {}} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Découvrez notre Box Karaoké en 3D
        </h1>
        
        <p className="text-gray-600 mb-8">
          Explorez notre espace karaoké en 3D. Utilisez votre souris pour faire pivoter la vue et la molette pour zoomer.
        </p>

        <div className="w-full h-[600px] bg-gray-100 rounded-lg shadow-lg overflow-hidden">
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

        <div className="mt-8 space-y-4 text-gray-600">
          <p>
            Cette visualisation 3D est une représentation temporaire de notre box karaoké.
            Des photos réelles seront bientôt disponibles.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Espace privatif confortable</li>
            <li>Grand écran pour les paroles</li>
            <li>Système audio professionnel</li>
            <li>Places assises confortables</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Box3D;