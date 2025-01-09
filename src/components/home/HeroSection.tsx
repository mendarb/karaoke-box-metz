import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, Apple, Wallet } from "lucide-react";

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
      <div className="absolute inset-0 bg-black/80" />
      
      <div className="relative z-10 md:text-left text-center space-y-4 max-w-3xl mx-auto px-6 md:px-8">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold flex flex-col items-center md:items-start gap-1.5">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm md:text-base mb-1.5">METZ</span>
            <span>Karaoké BOX</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-medium text-white/90">
            La première box karaoké privative de Metz
          </p>
        </div>
        <p className="text-base md:text-lg">
          profitez d'une expérience unique pour chanter en toute intimité
        </p>
        <div className="flex flex-col gap-4">
          <Button 
            asChild
            variant="secondary"
            className="w-full md:w-auto bg-white/20 hover:bg-white/30 text-white border border-white"
          >
            <Link to="/box-3d">
              Voir un visuel 3D de notre box
            </Link>
          </Button>
          
          <div class="flex flex-col items-center md:items-start gap-3 text-white/90">
  <span class="text-sm font-semibold">Paiements acceptés</span>
  <div class="w-full grid grid-cols-3 gap-4">
    <img
      src="/lovable-uploads/visa.svg"
      alt="Visa"
      class="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
    />
    <img
      src="/lovable-uploads/mastercard.svg"
      alt="MasterCard"
      class="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
    />
    <img
      src="/lovable-uploads/paypal.svg"
      alt="PayPal"
      class="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
    />
    <img
      src="/lovable-uploads/klarna.svg"
      alt="Klarna"
      class="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
    />
    <img
      src="/lovable-uploads/stripe.svg"
      alt="Stripe"
      class="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
    />
  </div>
</div>
        </div>
      </div>
    </div>
  );
};