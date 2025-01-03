import { Users, Music2, Calendar } from "lucide-react";

export const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
      <div className="bg-[#7E3AED] p-6 md:p-8 text-center text-white flex flex-col justify-center min-h-[200px]">
        <Users className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Salle privative</h3>
        <p className="text-sm md:text-base">Un espace rien que pour vous et vos proches</p>
      </div>
      <div className="bg-[#F5F3FF] p-6 md:p-8 text-center flex flex-col justify-center min-h-[200px]">
        <Music2 className="w-8 h-8 md:w-10 md:h-10 mx-auto text-kbox-coral mb-4" aria-hidden="true" />
        <h3 className="text-lg md:text-xl font-semibold text-kbox-coral mb-2">Large choix</h3>
        <p className="text-sm md:text-base text-gray-600">Des milliers de chansons disponibles</p>
      </div>
      <div className="bg-[#7E3AED] p-6 md:p-8 text-center text-white flex flex-col justify-center min-h-[200px]">
        <Calendar className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Horaires flexibles</h3>
        <p className="text-sm md:text-base">Du mercredi au dimanche, de 17h à 23h</p>
      </div>
    </div>
  );
};