import { Button } from "@/components/ui/button";
import { Box3DIcon } from "@/components/icons/Box3DIcon";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="flex flex-col justify-center min-h-[300px] px-6 py-8 md:py-12 bg-kbox-coral text-white">
      <div className="space-y-4 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">METZ</h1>
        <h2 className="text-2xl md:text-3xl font-semibold">Karaoké BOX</h2>
        <p className="text-lg md:text-xl">
          La première box karaoké privative de Metz
        </p>
        <p className="text-base md:text-lg opacity-90">
          Profitez d'une expérience unique pour chanter en toute intimité
        </p>
        <Link to="/box3d">
          <Button 
            variant="secondary" 
            className="mt-4 w-full md:w-auto hover:bg-white/90 transition-colors"
          >
            <Box3DIcon className="mr-2 h-4 w-4" />
            Voir un visuel 3D de notre box
          </Button>
        </Link>
      </div>
    </div>
  );
};