import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export const HeroSection = () => {
  const images = [
    {
      src: "/lovable-uploads/85294882-1624-4fa6-a2d0-09d415c43674.png",
      alt: "K.Box Intérieur"
    },
    {
      src: "/lovable-uploads/ca07e869-5579-405d-a730-cbd5aeb68818.png",
      alt: "K.Box Extérieur"
    },
    {
      src: "/lovable-uploads/cfa63d4d-3758-45b6-8316-13d7d026d109.png",
      alt: "K.Box Ambiance"
    }
  ];

  return (
    <div className="flex flex-col items-center px-4 py-8 bg-white">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Image Grid Carousel */}
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Votre Box Karaoké à Metz
          </h1>
          <p className="text-lg text-gray-600">
            Réservez votre session de karaoké privée, profitez d'une ambiance unique et chantez en toute intimité.
          </p>
          <Button 
            asChild
            className="w-full bg-kbox-coral hover:bg-kbox-orange-dark text-white py-6 rounded-full text-lg"
          >
            <Link to="/box-3d">
              Découvrir notre Box en 3D
            </Link>
          </Button>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-kbox-coral"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};