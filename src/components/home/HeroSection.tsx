import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-violet-50 to-white">
      <div className="container px-6 py-12 mx-auto">
        <div className="flex flex-col gap-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            METZ
            <span className="block text-violet-600 mt-2">Karaoké BOX</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            La première box karaoké privative de Metz
          </p>
          
          <p className="text-gray-600 max-w-xl mx-auto">
            Profitez d'une expérience unique pour chanter en toute intimité
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/booking">Réserver maintenant</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <Link to="/box">Voir un visuel 3D de notre box</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};