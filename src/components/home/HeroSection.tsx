import { Button } from "@/components/ui/button";
import { Box3DIcon } from "@/components/icons/Box3DIcon";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="relative flex flex-col justify-start p-12 h-full">
      <div className="space-y-4 max-w-xl">
        <h1 className="text-4xl font-bold tracking-tight animate-fadeIn">
          METZ
        </h1>
        <h2 className="text-3xl font-semibold animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          Karaoké BOX
        </h2>
        <p className="text-xl animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          La première box karaoké privative de Metz
        </p>
        <p className="text-lg opacity-90 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          Profitez d'une expérience unique pour chanter en toute intimité
        </p>
        <Link to="/box3d">
          <Button 
            variant="secondary" 
            className="mt-4 w-full md:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <Box3DIcon className="mr-2 h-4 w-4" />
            Voir un visuel 3D de notre box
          </Button>
        </Link>
      </div>
    </div>
  );
};