import { Navbar } from "@/components/navigation/Navbar";
import { BoxFeatures } from "@/components/3d/BoxFeatures";
import { Footer } from "@/components/home/Footer";

const Box3D = () => {
  return (
    <div className="min-h-screen flex flex-col bg-kbox-coral">
      <Navbar onShowAuth={() => {}} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-kbox-coral">
            Découvrez notre Box Karaoké
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="bg-kbox-pink p-6 rounded-lg">
                <img 
                  src="/lovable-uploads/cfa63d4d-3758-45b6-8316-13d7d026d109.png"
                  alt="K.Box Metz - Box Karaoké"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <p className="text-sm text-gray-600 text-center mt-4">
                  Représentation 3D de notre box karaoké à Metz (le résultat final peut légèrement différer)
                </p>
              </div>
            </div>

            <div className="bg-kbox-pink p-6 rounded-lg">
              <BoxFeatures />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Box3D;