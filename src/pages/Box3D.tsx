import { Navbar } from "@/components/navigation/Navbar";
import { Scene3D } from "@/components/3d/Scene3D";
import { BoxFeatures } from "@/components/3d/BoxFeatures";

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

          <BoxFeatures />
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Visualisation 3D Interactive
          </h2>
          <p className="text-gray-600 mb-4">
            Explorez notre espace en 3D. Utilisez votre souris pour faire pivoter la vue et la molette pour zoomer.
          </p>
          <Scene3D />
        </div>
      </main>
    </div>
  );
};

export default Box3D;