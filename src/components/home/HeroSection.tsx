import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export const HeroSection = () => {
  const images = [
    {
      src: "/lovable-uploads/72f8f139-d39e-4cac-b328-14d86dbc6927.png",
      alt: "Groupe d'amis chantant au karaoké"
    },
    {
      src: "/lovable-uploads/387fe7cf-fb7e-4eee-9475-811929d83f3f.png",
      alt: "Amies chantant ensemble"
    },
    {
      src: "/lovable-uploads/af58212b-7638-481c-a89c-feb3f2e7b8e2.png",
      alt: "Ambiance karaoké entre amis"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)] py-8">
          {/* Colonne de gauche - Texte et CTA */}
          <div className="space-y-8 max-w-xl">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Votre Box Karaoké Privée à Metz
            </h1>
            <p className="text-xl text-gray-600">
              Réservez votre session privée, profitez d'une ambiance unique et chantez en toute intimité avec vos amis.
            </p>
            <div className="space-y-4">
              <Button 
                asChild
                className="w-full lg:w-auto bg-kbox-coral hover:bg-kbox-orange-dark text-white py-6 px-8 rounded-full text-lg shadow-lg transition-all duration-300"
              >
                <Link to="/box-3d">
                  Découvrir notre Box en 3D
                </Link>
              </Button>
              
              <div className="flex items-center justify-start space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-kbox-pink flex items-center justify-center">
                    <span className="text-kbox-coral">🎤</span>
                  </div>
                  <span className="text-gray-700">Équipement Pro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-kbox-pink flex items-center justify-center">
                    <span className="text-kbox-coral">🎵</span>
                  </div>
                  <span className="text-gray-700">+2000 Chansons</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne de droite - Carousel d'images */}
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index} className="relative">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Badges flottants */}
            <div className="absolute -bottom-4 left-4 right-4 flex justify-between">
              <div className="bg-white px-6 py-3 rounded-full shadow-lg">
                <span className="text-kbox-coral font-medium">Jusqu'à 15 personnes</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-full shadow-lg">
                <span className="text-kbox-coral font-medium">7j/7 de 14h à 2h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};