import { Users, Music2, Calendar } from "lucide-react";

export const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
      <div className="bg-[#7E3AED] p-8 text-center text-white">
        <Users className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-white">Salle privative</h3>
        <p>Un espace rien que pour vous et vos proches</p>
      </div>
      <div className="bg-white p-8 text-center">
        <Music2 className="w-12 h-12 mx-auto mb-4 text-kbox-coral" />
        <h3 className="text-xl font-semibold mb-2 text-kbox-coral">Large choix</h3>
        <p className="text-gray-600">Des milliers de chansons disponibles</p>
      </div>
      <div className="bg-[#7E3AED] p-8 text-center text-white">
        <Calendar className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-white">Horaires flexibles</h3>
        <p>Du mercredi au dimanche, de 17h à 23h</p>
      </div>
    </div>
  );
};