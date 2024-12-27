import { Navbar } from "@/components/navigation/Navbar";
import { BoxFeatures } from "@/components/3d/BoxFeatures";
import { Footer } from "@/components/home/Footer";
import { ImageLightbox } from "@/components/ui/image-lightbox";

const Box3D = () => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar onShowAuth={() => {}} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="glass p-6 rounded-lg">
              <ImageLightbox 
                src="/lovable-uploads/cfa63d4d-3758-45b6-8316-13d7d026d109.png"
                alt="K.Box Metz - Box Karaoké"
                className="w-full h-auto rounded-lg"
              />
              <p className="text-sm text-gray-600 text-center mt-4">
                Représentation 3D de notre box karaoké à Metz (le résultat final peut légèrement différer)
              </p>
            </div>

            <div className="glass p-6 rounded-lg">
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