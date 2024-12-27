import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Box, Text } from "@react-three/drei";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Navbar } from "@/components/navigation/Navbar";

const KaraokeBox = () => {
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

const Box3D = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onShowAuth={() => {}} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Découvrez notre Box Karaoké
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <img 
              src="/lovable-uploads/cfa63d4d-3758-45b6-8316-13d7d026d109.png"
              alt="K.Box Metz - Box Karaoké"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <p className="text-sm text-gray-600 mt-2 text-center">
              Notre box karaoké à Metz
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Un espace privatif unique
            </h2>
            <p className="text-gray-600">
              Découvrez notre box karaoké moderne et confortable, équipée des dernières technologies pour une expérience inoubliable :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Écran HD avec interface intuitive</li>
              <li>Système audio professionnel</li>
              <li>Banquettes confortables</li>
              <li>Éclairage d'ambiance LED</li>
              <li>Boule disco pour une ambiance festive</li>
              <li>Table basse pour vos consommations</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Visualisation 3D Interactive
          </h2>
          <p className="text-gray-600 mb-4">
            Explorez notre espace en 3D. Utilisez votre souris pour faire pivoter la vue et la molette pour zoomer.
          </p>
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
        </div>
      </main>
    </div>
  );
};

export default Box3D;