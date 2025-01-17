import { Box3DIcon } from "@/components/icons/Box3DIcon";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="bg-[#F97316]">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
        <div className="flex flex-col justify-center bg-[#F1F1F1] order-2 md:order-1 p-8 md:p-12 lg:p-16">
          <div className="space-y-6">
            <div className="inline-block p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Box3DIcon className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Votre Box Karaoké
              <br />à Metz
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-[600px]">
              Profitez d'une expérience unique dans notre box karaoké privative.
              Chantez vos chansons préférées en toute intimité !
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-gray-900 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Réserver maintenant
              </Link>
              <Link
                to="/box3d"
                className="inline-flex h-11 items-center justify-center rounded-md border border-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Voir la salle en 3D
              </Link>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <h3 className="text-lg font-medium">Moyens de paiement acceptés</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              <div className="flex items-center justify-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/apple pay.svg" alt="Apple Pay" className="h-8" />
              </div>
              <div className="flex items-center justify-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/paypal.svg" alt="PayPal" className="h-8" />
              </div>
              <div className="flex items-center justify-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/stripe.svg" alt="Stripe" className="h-8" />
              </div>
              <div className="flex items-center justify-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/klarna.svg" alt="Klarna" className="h-8" />
              </div>
              <div className="flex items-center justify-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/visa.svg" alt="Visa" className="h-8" />
              </div>
              <div className="flex items-center justify-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/Mastercard.svg" alt="Mastercard" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};