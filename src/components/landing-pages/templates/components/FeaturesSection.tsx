import { Music, Users, Heart } from "lucide-react";

interface FeaturesSectionProps {
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export const FeaturesSection = ({ features }: FeaturesSectionProps) => {
  const defaultFeatures = [
    {
      icon: "music",
      title: "Équipement Pro",
      description: "Son haute qualité et écrans HD pour une expérience optimale"
    },
    {
      icon: "users",
      title: "Box Privatifs",
      description: "Espaces insonorisés pour chanter en toute intimité"
    },
    {
      icon: "heart",
      title: "Ambiance Unique",
      description: "Une atmosphère chaleureuse et conviviale"
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "music":
        return <Music className="h-6 w-6 text-violet-600" />;
      case "users":
        return <Users className="h-6 w-6 text-violet-600" />;
      case "heart":
        return <Heart className="h-6 w-6 text-violet-600" />;
      default:
        return <Music className="h-6 w-6 text-violet-600" />;
    }
  };

  const displayFeatures = features || defaultFeatures;

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="/lovable-uploads/71abef1d-375e-47bb-afb7-77d8435491e6.png"
              alt="Groupe karaoké"
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-900">Une expérience unique</h2>
            <div className="space-y-6">
              {displayFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {getIcon(feature.icon)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};