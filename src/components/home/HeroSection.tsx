import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div
      className="relative min-h-[50vh] flex items-center text-white hero-section"
      style={{
        backgroundImage: 'url("/lovable-uploads/ddb1e7ee-662c-40f9-866a-828f1c15b054.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 w-full space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold flex flex-col items-center md:items-start gap-2">
            <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-sm md:text-base">
              METZ
            </span>
            <span>Karaoké BOX</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-medium text-white/90 text-center md:text-left">
            La première box karaoké privative de Metz
          </p>
        </div>
        
        <p className="text-base md:text-lg text-center md:text-left">
          Profitez d'une expérience unique pour chanter en toute intimité
        </p>

        <div className="flex flex-col gap-6">
          <Button
            asChild
            variant="secondary"
            className="w-full md:w-auto bg-white/20 hover:bg-white/30 text-white border border-white"
          >
            <Link to="/box-3d">Voir un visuel 3D de notre box</Link>
          </Button>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-center md:text-left text-white/90">
              Paiements acceptés
            </p>
            <div className="flex justify-center md:justify-start gap-4 items-center">
              <img
                src="/lovable-uploads/visa.svg"
                alt="Visa"
                className="w-12 h-12 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
              <img
                src="/lovable-uploads/mastercard.svg"
                alt="MasterCard"
                className="w-12 h-12 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
              <img
                src="/lovable-uploads/paypal.svg"
                alt="PayPal"
                className="w-12 h-10 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
              <img
                src="/lovable-uploads/klarna.svg"
                alt="Klarna"
                className="w-12 h-12 object-contain opacity-80 hover:opacity-100 filter invert transition-opacity duration-300"
              />
              <img
                src="/lovable-uploads/stripe.svg"
                alt="Stripe"
                className="w-12 h-12 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};