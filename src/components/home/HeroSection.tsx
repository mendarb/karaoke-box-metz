import { Button } from "@/components/ui/button";
import { Box3DIcon } from "@/components/icons/Box3DIcon";
import { Link } from "react-router-dom";
import BookingSection from "./BookingSection";

export const HeroSection = () => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
        <div className="relative min-h-[600px] bg-[#FF6B6B] text-white">
          <div className="flex flex-col justify-between h-full p-12">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-white/10">
                <h1 className="text-sm font-medium">
                  METZ
                </h1>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-semibold">
                  Karaoké BOX
                </h2>
                <p className="text-2xl">
                  La première box karaoké privative de Metz
                </p>
                <p className="text-lg text-white/80">
                  Profitez d'une expérience unique pour chanter en toute intimité
                </p>
              </div>

              <Link to="/box3d">
                <Button 
                  variant="secondary" 
                  className="mt-4 w-full md:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Box3DIcon className="mr-2 h-4 w-4" />
                  Voir un visuel 3D de notre box
                </Button>
              </Link>
            </div>

            <div className="mt-auto">
              <h3 className="text-sm font-medium text-white/90 mb-4">
                Paiements acceptés
              </h3>
              <div className="flex items-center gap-4">
                <img src="/lovable-uploads/visa.svg" alt="Visa" className="h-6" />
                <img src="/lovable-uploads/Mastercard.svg" alt="Mastercard" className="h-6" />
                <img src="/lovable-uploads/paypal.svg" alt="PayPal" className="h-6" />
                <img src="/lovable-uploads/klarna.svg" alt="Klarna" className="h-6" />
                <img src="/lovable-uploads/apple pay.svg" alt="Apple Pay" className="h-6" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white min-h-[600px] flex items-center justify-center p-8">
          <BookingSection />
        </div>
      </div>
    </div>
  );
};