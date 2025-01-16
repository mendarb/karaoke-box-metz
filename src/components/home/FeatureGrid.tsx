import { Clock, Music, Users } from "lucide-react";

export const FeatureGrid = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Salle privative",
      description: "Un espace rien que pour vous et vos proches"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Large choix",
      description: "Des milliers de chansons disponibles"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Horaires flexibles",
      description: "Du mercredi au dimanche, de 17h à 23h"
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="container px-6 mx-auto">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-white"
            >
              <div className="p-3 bg-violet-100 rounded-lg text-violet-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};