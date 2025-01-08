import { Clock, Home, Music, Users } from "lucide-react";

export const FeatureList = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
        <Home className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
        <div>
          <span className="font-medium text-white">Box Privative</span>
          <p className="text-sm text-white/80">Espace intime et confortable</p>
        </div>
      </div>
      <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
        <Music className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
        <div>
          <span className="font-medium text-white">Catalogue Musical</span>
          <p className="text-sm text-white/80">Plus de 30 000 titres disponibles</p>
        </div>
      </div>
      <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
        <Clock className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
        <div>
          <span className="font-medium text-white">Horaires</span>
          <p className="text-sm text-white/80">Du mercredi au dimanche, 17h-23h</p>
        </div>
      </div>
      <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
        <Users className="w-5 h-5 text-white/90 group-hover:rotate-6 transition-transform duration-200" />
        <div>
          <span className="font-medium text-white">Entre Amis</span>
          <p className="text-sm text-white/80">Capacité jusqu'à 15 personnes</p>
        </div>
      </div>
    </div>
  );
};