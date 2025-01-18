import { Box3DIcon } from "@/components/icons/Box3DIcon";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F1F1F1]">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
        <div 
          className="flex flex-col justify-center bg-kbox-orange order-2 md:order-1"
        >
          <div className="space-y-3 relative z-10 p-4 md:p-6 lg:p-8">
            <div className="inline-block p-2 bg-white/5 rounded-xl backdrop-blur-sm">
              <Box3DIcon className="w-5 h-5" />
            </div>
            <img 
              src="/lovable-uploads/00c7f745-4d39-4456-b872-b0111b649a57.png" 
              alt="K-Box Logo" 
              className="w-auto h-12 md:h-16"
            />
            <p className="text-sm md:text-base text-white/90 max-w-[500px] leading-relaxed">
              Profitez d'une expérience unique dans notre box karaoké privative.
              Chantez vos chansons préférées en toute intimité !
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => navigate("/box-3d")}
                variant="secondary"
                className="bg-white hover:bg-white/90 text-black"
              >
                Voir la salle en 3D
              </Button>
            </div>
            <div className="mt-8">
              <p className="text-sm text-white/80 mb-3">Moyens de paiement acceptés</p>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-all">
                  <img 
                    src="/lovable-uploads/apple pay.svg" 
                    alt="Apple Pay" 
                    className="h-4 w-auto brightness-0 invert"
                  />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-all">
                  <img 
                    src="/lovable-uploads/paypal.svg" 
                    alt="PayPal" 
                    className="h-5 w-auto brightness-0 invert" 
                  />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-all">
                  <img 
                    src="/lovable-uploads/stripe.svg" 
                    alt="Stripe" 
                    className="h-4 w-auto brightness-0 invert" 
                  />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-all">
                  <img 
                    src="/lovable-uploads/klarna.svg" 
                    alt="Klarna" 
                    className="h-3.5 w-auto brightness-0 invert" 
                  />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-all">
                  <img 
                    src="/lovable-uploads/visa.svg" 
                    alt="Visa" 
                    className="h-4 w-auto brightness-0 invert" 
                  />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-all">
                  <img 
                    src="/lovable-uploads/Mastercard.svg" 
                    alt="Mastercard" 
                    className="h-4 w-auto brightness-0 invert" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[600px]">
          <img 
            src="/lovable-uploads/f0321335-189d-4fe7-b21f-199edaf22a37.png"
            alt="K-Box Ambiance"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};