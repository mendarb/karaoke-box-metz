import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div 
      className="relative h-[50vh] bg-kbox-coral flex items-center text-white"
    >
      <div className="relative z-10 md:text-left text-center space-y-2 max-w-3xl mx-auto px-6 md:px-8">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold flex flex-col items-center md:items-start gap-1.5">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm md:text-base mb-1.5">METZ</span>
            <span>Découvrez K.Box</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-medium text-white/90">
            La première box karaoké privative
          </p>
        </div>
        <p className="text-base md:text-lg">
          Une expérience unique pour chanter en toute intimité
        </p>
        <Button 
          asChild
          variant="secondary"
          className="w-full md:w-auto bg-white/20 hover:bg-white/30 text-white border border-white mt-2"
        >
          <Link to="/box-3d">
            Voir le rendu 3D de notre box
          </Link>
        </Button>
      </div>
    </div>
  );
};