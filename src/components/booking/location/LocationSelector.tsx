import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationSelectorProps {
  onSelect: (location: string) => void;
}

export const LocationSelector = ({ onSelect }: LocationSelectorProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-lg font-semibold text-center mb-6">
        Choisissez votre box karaoké
      </h2>
      
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-video relative overflow-hidden">
          <img
            src="/lovable-uploads/3ab8ee40-9c29-4b13-8dfb-3bd090d2a8ed.png"
            alt="K.Box Metz - Box Karaoké"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">K.Box Metz</h3>
            
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-violet-600" />
                <span>12 Rue des Huiliers, 57000 Metz</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-violet-600" />
                <span>Jusqu'à 10 personnes</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-violet-600" />
                <span>À partir de 7.80€ par personne/heure</span>
              </div>
            </div>

            <Button 
              className="w-full mt-4"
              onClick={() => onSelect('metz')}
            >
              Sélectionner
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};