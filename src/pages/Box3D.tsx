import { Navbar } from "@/components/navigation/Navbar";
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
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/cfa63d4d-3758-45b6-8316-13d7d026d109.png"
              alt="K.Box Metz - Box Karaoké"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <p className="text-sm text-gray-600 text-center">
              Notre box karaoké à Metz
            </p>
          </div>

          <BoxFeatures />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/d45fd1b9-de1b-40a3-ae6b-4072948883a6.png"
              alt="K.Box Metz - Intérieur"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <p className="text-sm text-gray-600 text-center">
              Vue intérieure de notre box
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Une expérience unique</h2>
            <p className="text-gray-600">
              Profitez d'un espace privatif moderne et confortable, parfait pour vos soirées karaoké entre amis ou en famille. Notre box est équipée des dernières technologies pour vous garantir une expérience inoubliable.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Système audio professionnel</li>
              <li>Large sélection de chansons</li>
              <li>Ambiance personnalisable</li>
              <li>Service de boissons disponible</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Box3D;