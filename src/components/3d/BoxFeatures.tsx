export const BoxFeatures = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-kbox-coral">
        Un espace privatif unique
      </h2>
      <p className="text-gray-600">
        Découvrez notre box karaoké moderne et confortable, équipée des dernières technologies pour une expérience inoubliable :
      </p>
      <ul className="list-none space-y-3">
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
            className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg shadow-sm"
          >
            <span className="w-2 h-2 bg-kbox-coral rounded-full"></span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};