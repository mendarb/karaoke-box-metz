export const BoxFeatures = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-kbox-coral">
          Un espace privatif unique
        </h2>
        <p className="text-gray-600 text-sm">
          Découvrez notre box karaoké moderne et confortable, équipée des dernières technologies pour une expérience inoubliable :
        </p>
      </div>
      
      <ul className="space-y-3">
        {[
          'Écran HD avec interface intuitive',
          'Système audio professionnel',
          'Banquettes confortables',
          'Éclairage d\'ambiance LED',
          'Boule disco pour une ambiance festive',
          'Table basse pour vos consommations'
        ].map((feature, index) => (
          <li 
            key={index}
            className="flex items-center space-x-3 text-sm"
          >
            <span className="w-1.5 h-1.5 bg-kbox-coral rounded-full flex-shrink-0"></span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};