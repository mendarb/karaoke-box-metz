import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet } from "lucide-react";

export const HeroSection = () => {
  return (
    <div 
      className="relative h-[50vh] flex items-center text-white"
      style={{
        backgroundImage: 'url("/lovable-uploads/ddb1e7ee-662c-40f9-866a-828f1c15b054.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 md:text-left text-center space-y-4 max-w-3xl mx-auto px-6 md:px-8">
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
        <div className="flex flex-col gap-4">
          <Button 
            asChild
            variant="secondary"
            className="w-full md:w-auto bg-white/20 hover:bg-white/30 text-white border border-white"
          >
            <Link to="/box-3d">
              Voir le rendu 3D de notre box
            </Link>
          </Button>
          
          <div className="flex items-center justify-center md:justify-start gap-3 text-white/90">
            <span className="text-sm">Paiements acceptés:</span>
            <div className="flex gap-2">
              <CreditCard className="w-6 h-6" />
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};