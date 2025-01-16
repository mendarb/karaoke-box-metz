export const FeatureGrid = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Salle privative
            </h3>
            <p className="text-gray-600">
              Un espace rien que pour vous et vos proches
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Large choix
            </h3>
            <p className="text-gray-600">
              Des milliers de chansons disponibles
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Horaires flexibles
            </h3>
            <p className="text-gray-600">
              Du mercredi au dimanche, de 17h à 23h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};