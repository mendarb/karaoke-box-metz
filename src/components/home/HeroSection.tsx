import { Users, Music2, Calendar } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="bg-white/10 p-8 flex flex-col justify-center">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Votre Box Karaoké Privatif à Metz
      </h1>
      <p className="text-white/90 mb-6">
        Partagez des moments uniques avec vos proches dans notre espace privatif et confortable.
      </p>
      <div className="inline-block bg-kbox-coral text-white px-6 py-3 w-fit border border-white">
        À partir de 10€ par pers. et par heure
      </div>
    </div>
  );
};