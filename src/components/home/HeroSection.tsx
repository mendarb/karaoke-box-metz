import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div 
      className="relative h-[90vh] bg-kbox-coral flex items-center justify-center text-white"
    >
      <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          Votre Box Karaoké Privative à Metz
        </h1>
        <p className="text-lg md:text-xl">
          Une expérience unique pour chanter en toute intimité
        </p>
        <Link 
          to="/box-3d" 
          className="inline-block bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 md:px-6 md:py-3 w-full text-center border border-white text-sm md:text-base"
        >
          Voir le rendu 3D de notre box
        </Link>
      </div>
    </div>
  );
};