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
    <div className="flex flex-col items-center px-4 py-8 bg-white">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Image Grid Carousel */}
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Text Content */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Votre Box Karaoké à Metz
          </h1>
          <p className="text-lg text-gray-600 px-4">
            Réservez votre session privée, profitez d'une ambiance unique et chantez en toute intimité
          </p>
          <Button 
            asChild
            className="w-full bg-kbox-coral hover:bg-kbox-orange-dark text-white py-6 rounded-full text-lg shadow-lg"
          >
            <Link to="/box-3d">
              Découvrir notre Box en 3D
            </Link>
          </Button>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-2 rounded-full bg-kbox-coral"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};