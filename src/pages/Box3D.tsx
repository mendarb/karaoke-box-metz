import { BoxFeatures } from "@/components/3d/BoxFeatures";
import Footer from "@/components/home/Footer";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { Package, Music, Users } from "lucide-react";

const Box3D = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary to-white">
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-6 px-4 md:px-8 py-12">
              <div className="overflow-hidden">
                <ImageLightbox 
                  src="/lovable-uploads/cfa63d4d-3758-45b6-8316-13d7d026d109.png"
                  alt="K.Box Metz - Box Karaoké"
                  className="w-full h-auto"
                />
                <div className="p-4 bg-white/90">
                  <p className="text-sm text-gray-600 text-center">
                    Rendu 3D de notre box karaoké à Metz
                    <br />
                    <span className="text-xs italic">(le résultat final peut légèrement différer)</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: <Package className="h-8 w-8 text-kbox-coral" />,
                    title: "Box Privative",
                    description: "Espace intime et confortable"
                  },
                  {
                    icon: <Music className="h-8 w-8 text-kbox-coral" />,
                    title: "Catalogue Musical",
                    description: "Plus de 30 000 titres disponibles"
                  },
                  {
                    icon: <Users className="h-8 w-8 text-kbox-coral" />,
                    title: "Entre Amis",
                    description: "Capacité jusqu'à 10 personnes"
                  }
                ].map((feature, index) => (
                  <div key={index} className="p-4 text-center bg-white/90 rounded-lg shadow-sm">
                    <div className="flex flex-col items-center space-y-2">
                      {feature.icon}
                      <h3 className="font-semibold text-kbox-coral">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky top-4 px-4 md:px-8 py-12">
              <div className="bg-white/90 p-8 rounded-lg shadow-sm">
                <BoxFeatures />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Box3D;