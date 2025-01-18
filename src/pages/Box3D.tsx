import { BoxFeatures } from "@/components/3d/BoxFeatures";
import Footer from "@/components/home/Footer";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { Package, Music, Users } from "lucide-react";

const Box3D = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg shadow-sm">
                <ImageLightbox 
                  src="/lovable-uploads/cfa63d4d-3758-45b6-8316-13d7d026d109.png"
                  alt="K.Box Metz - Box Karaoké"
                  className="w-full h-auto"
                />
                <div className="p-4 bg-white">
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
                  <div key={index} className="p-4 text-center bg-white rounded-lg shadow-sm">
                    <div className="flex flex-col items-center space-y-2">
                      {feature.icon}
                      <h3 className="font-semibold text-kbox-coral">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky top-4">
              <div className="bg-white p-8 rounded-lg shadow-sm">
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