import { Home, Music2, Clock } from "lucide-react";

export const FeatureGrid = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-violet-50 hover:bg-violet-100 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-violet-200 rounded-lg">
                <Home className="w-5 h-5 text-violet-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Salle privative
              </h3>
            </div>
            <p className="text-gray-600">
              Un espace rien que pour vous et vos proches
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-violet-50 hover:bg-violet-100 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-violet-200 rounded-lg">
                <Music2 className="w-5 h-5 text-violet-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Large choix
              </h3>
            </div>
            <p className="text-gray-600">
              Des milliers de chansons disponibles
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-violet-50 hover:bg-violet-100 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-violet-200 rounded-lg">
                <Clock className="w-5 h-5 text-violet-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Horaires flexibles
              </h3>
            </div>
            <p className="text-gray-600">
              Du mercredi au dimanche, de 17h à 23h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};