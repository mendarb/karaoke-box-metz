import { Box3DIcon } from "@/components/icons/Box3DIcon";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const HeroSection = () => {
  const { data: announcement } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="bg-[#F1F1F1]">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
        <div 
          className="flex flex-col justify-center bg-[#1E1E1E] order-2 md:order-1 p-4 md:p-6 lg:p-8 relative"
        >
          <div className="space-y-3 relative z-10">
            <div className="inline-block p-2 bg-white/5 rounded-xl backdrop-blur-sm">
              <Box3DIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-white">
              {announcement?.message || (
                <>
                  Votre Box Karaoké
                  <br />
                  à Metz
                </>
              )}
            </h1>
            <p className="text-sm md:text-base text-white/90 max-w-[500px] leading-relaxed">
              Profitez d'une expérience unique dans notre box karaoké privative.
              Chantez vos chansons préférées en toute intimité !
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/box3d"
                className="inline-flex h-9 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/20 transition-all hover:scale-105"
              >
                Voir la salle en 3D
              </Link>
            </div>
          </div>

          <div className="mt-6 space-y-2 relative z-10">
            <h3 className="text-xs font-medium text-white/90">Moyens de paiement acceptés</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <div className="flex items-center justify-center p-1.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/apple pay.svg" alt="Apple Pay" className="h-5" />
              </div>
              <div className="flex items-center justify-center p-1.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/paypal.svg" alt="PayPal" className="h-5" />
              </div>
              <div className="flex items-center justify-center p-1.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/stripe.svg" alt="Stripe" className="h-5" />
              </div>
              <div className="flex items-center justify-center p-1.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/klarna.svg" alt="Klarna" className="h-5" />
              </div>
              <div className="flex items-center justify-center p-1.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/visa.svg" alt="Visa" className="h-5" />
              </div>
              <div className="flex items-center justify-center p-1.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <img src="/lovable-uploads/Mastercard.svg" alt="Mastercard" className="h-5" />
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