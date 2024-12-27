import { Navbar } from "@/components/navigation/Navbar";
import { BoxFeatures } from "@/components/3d/BoxFeatures";
import { Footer } from "@/components/home/Footer";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { Package, Music, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const Box3D = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary to-white">
      <Navbar onShowAuth={() => {}} />
      
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <ImageLightbox 
                  src="/lovable-uploads/cfa63d4d-3758-45b6-8316-13d7d026d109.png"
                  alt="K.Box Metz - Box Karaoké"
                  className="w-full h-auto"
                />
                <div className="p-4 bg-white/90 backdrop-blur-sm">
                  <p className="text-sm text-gray-600 text-center">
                    Représentation 3D de notre box karaoké à Metz
                    <br />
                    <span className="text-xs italic">(le résultat final peut légèrement différer)</span>
                  </p>
                </div>
              </Card>

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
                  <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center space-y-2">
                      {feature.icon}
                      <h3 className="font-semibold text-kbox-coral">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="sticky top-4">
              <Card className="backdrop-blur-sm bg-white/90 shadow-lg p-8 space-y-6">
                <BoxFeatures />
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Box3D;