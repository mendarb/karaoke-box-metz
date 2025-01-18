import { Box3DIcon } from "@/components/icons/Box3DIcon";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F1F1F1]">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
        <div 
          className="flex flex-col justify-center bg-kbox-orange order-2 md:order-1 p-4 md:p-6 lg:p-8 relative"
        >
          <div className="space-y-3 relative z-10">
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
              <div className="flex gap-4">
                <img src="/lovable-uploads/apple pay.svg" alt="Apple Pay" className="h-8" />
                <img src="/lovable-uploads/paypal.svg" alt="PayPal" className="h-8" />
                <img src="/lovable-uploads/stripe.svg" alt="Stripe" className="h-8" />
                <img src="/lovable-uploads/klarna.svg" alt="Klarna" className="h-8" />
                <img src="/lovable-uploads/visa.svg" alt="Visa" className="h-8" />
                <img src="/lovable-uploads/Mastercard.svg" alt="Mastercard" className="h-8" />
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div 
            className="w-full h-[400px] bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("/lovable-uploads/4358a191-e1a1-4fea-bdca-01f0adbcd973.png")',
            }}
          />
        </div>
      </div>
    </div>
  );
};