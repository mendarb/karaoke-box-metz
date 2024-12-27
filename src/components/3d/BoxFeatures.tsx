import { Check } from "lucide-react";

export const BoxFeatures = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-kbox-coral">
          Un espace privatif unique
        </h2>
        <p className="text-gray-600">
          Découvrez notre box karaoké moderne et confortable, équipée des dernières technologies pour une expérience inoubliable.
        </p>
      </div>
      
      <ul className="space-y-4">
        {[
          'Écran HD avec interface intuitive',
          'Système audio professionnel',
          'Banquettes confortables',
          'Éclairage d\'ambiance LED',
          'Boule disco pour une ambiance festive',
          'Table basse pour vos consommations',
          'Catalogue de plus de 30 000 musiques',
          'Isolation phonique performante',
          'Service en salle disponible'
        ].map((feature, index) => (
          <li 
            key={index}
            className="flex items-center space-x-3 text-gray-700 hover:text-kbox-coral transition-colors"
          >
            <Check className="h-5 w-5 text-kbox-coral flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 italic">
          Tous nos équipements sont régulièrement entretenus et mis à jour pour vous garantir une expérience optimale.
        </p>
      </div>
    </div>
  );
};