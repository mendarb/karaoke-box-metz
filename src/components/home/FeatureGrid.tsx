import { Home, Music2, Clock } from "lucide-react";

export const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <div className="bg-violet-600 text-white p-12 flex flex-col items-center text-center">
        <div className="p-2 bg-white/10 rounded-lg mb-4">
          <Home className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Salle privative
        </h3>
        <p className="text-white/80">
          Un espace rien que pour vous et vos proches
        </p>
      </div>
      
      <div className="bg-white p-12 flex flex-col items-center text-center">
        <div className="p-2 bg-red-100 rounded-lg mb-4">
          <Music2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Large choix
        </h3>
        <p className="text-gray-600">
          Des milliers de chansons disponibles
        </p>
      </div>
      
      <div className="bg-violet-600 text-white p-12 flex flex-col items-center text-center">
        <div className="p-2 bg-white/10 rounded-lg mb-4">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Horaires flexibles
        </h3>
        <p className="text-white/80">
          Du mercredi au dimanche, de 17h à 23h
        </p>
      </div>
    </div>
  );
};