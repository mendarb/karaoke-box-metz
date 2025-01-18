import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LocationSelectorProps {
  onSelect: (location: string) => void;
}

export const LocationSelector = ({ onSelect }: LocationSelectorProps) => {
  const { data: boxes, isLoading } = useQuery({
    queryKey: ['karaoke-boxes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('karaoke_boxes')
        .select('*')
        .eq('status', 'active')
        .is('deleted_at', null);
      
      if (error) throw error;
      return data;
    },
  });

  const handleSelect = (location: string) => {
    toast({
      title: "Box sélectionnée",
      description: "Vous pouvez maintenant passer à l'étape suivante",
    });
    onSelect(location);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-lg font-semibold text-center mb-6">
        Choisissez votre box karaoké
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        {boxes?.map((box) => (
          <Card key={box.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={box.image_url || "/placeholder.svg"}
                alt={`${box.name} - Box Karaoké`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{box.name}</h3>
                
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-violet-600" />
                    <span>{box.address}, {box.postal_code} {box.city}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-violet-600" />
                    <span>Jusqu'à {box.capacity} personnes</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-violet-600" />
                    <span>À partir de {box.base_price_per_hour}€ par personne/heure</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4"
                  onClick={() => handleSelect(box.name.toLowerCase())}
                >
                  Sélectionner
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};