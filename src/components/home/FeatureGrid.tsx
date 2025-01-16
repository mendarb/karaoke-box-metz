import { Users, Music2, Calendar } from "lucide-react";

export const FeatureGrid = () => {
  return (
    <div className="feature-grid">
      <div className="feature-item bg-[#7E3AED] text-white">
        <Users className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Salle privative</h3>
        <p className="text-sm md:text-base">Un espace rien que pour vous et vos proches</p>
      </div>
      <div className="feature-item bg-[#F5F3FF]">
        <Music2 className="w-8 h-8 md:w-10 md:h-10 mx-auto text-kbox-coral mb-4" aria-hidden="true" />
        <h3 className="text-lg md:text-xl font-semibold text-kbox-coral mb-2">Large choix</h3>
        <p className="text-sm md:text-base text-gray-600">Des milliers de chansons disponibles</p>
      </div>
      <div className="feature-item bg-[#7E3AED] text-white">
        <Calendar className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Horaires flexibles</h3>
        <p className="text-sm md:text-base">Du mercredi au dimanche, de 17h à 23h</p>
      </div>
    </div>
  );
};