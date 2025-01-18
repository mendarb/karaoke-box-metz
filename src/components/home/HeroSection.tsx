import { Box3DIcon } from "@/components/icons/Box3DIcon";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="bg-[#F1F1F1]">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
        <div 
          className="flex flex-col justify-center bg-[#ec6342] order-2 md:order-1 p-6 md:p-8 lg:p-12 relative"
        >
          <div className="space-y-4 relative z-10">
            <div className="inline-block p-2 bg-[#ec6342]/10 rounded-xl backdrop-blur-sm">
              <Box3DIcon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white">
              Votre Box Karaoké
              <br />à Metz
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-[500px] leading-relaxed">
              Profitez d'une expérience unique dans notre box karaoké privative.
              Chantez vos chansons préférées en toute intimité !
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/box3d"
                className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-6 text-sm font-medium text-white hover:bg-white/20 transition-colors"
              >
                Voir la salle en 3D
              </Link>
            </div>
          </div>

          <div className="mt-8 space-y-3 relative z-10">
            <h3 className="text-sm font-medium text-white/90">Moyens de paiement acceptés</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/apple pay.svg" alt="Apple Pay" className="h-6" />
              </div>
              <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/paypal.svg" alt="PayPal" className="h-6" />
              </div>
              <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/stripe.svg" alt="Stripe" className="h-6" />
              </div>
              <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/klarna.svg" alt="Klarna" className="h-6" />
              </div>
              <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/visa.svg" alt="Visa" className="h-6" />
              </div>
              <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/Mastercard.svg" alt="Mastercard" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="w-full h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/lovable-uploads/4358a191-e1a1-4fea-bdca-01f0adbcd973.png")',
        }}
      />
    </div>
  );
};