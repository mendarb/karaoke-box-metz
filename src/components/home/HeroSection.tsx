import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div 
      className="relative h-[60vh] bg-kbox-coral flex items-center text-white"
    >
      <div className="relative z-10 md:text-left text-center space-y-3 max-w-3xl mx-auto px-6 md:px-8">
        <div className="space-y-1.5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold flex flex-col items-center md:items-start gap-2">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-lg md:text-xl mb-2">METZ</span>
            <span>Découvrez K.Box</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90">
            La première box karaoké privative
          </p>
        </div>
        <p className="text-lg md:text-xl">
          Une expérience unique pour chanter en toute intimité
        </p>
        <Button 
          asChild
          variant="secondary"
          className="w-full md:w-auto bg-white/20 hover:bg-white/30 text-white border border-white"
        >
          <Link to="/box-3d">
            Voir le rendu 3D de notre box
          </Link>
        </Button>
      </div>
    </div>
  );
};