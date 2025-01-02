import { Card, CardContent } from "@/components/ui/card";
import { Euro } from "lucide-react";

interface PriceDisplayProps {
  groupSize: string;
  duration: string;
  price: number;
  pricePerPersonPerHour: number;
}

export const PriceDisplay = ({
  groupSize,
  duration,
  price,
  pricePerPersonPerHour
}: PriceDisplayProps) => {
  return (
    <Card className="bg-violet-50 border-violet-100">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Euro className="h-5 w-5 text-violet-600" />
            <span className="text-sm font-medium text-violet-900">Prix total</span>
          </div>
          <span className="text-xl font-bold text-violet-900">{price}€</span>
        </div>
        
        <div className="text-xs text-violet-600 flex justify-between items-center">
          <span>Prix par personne et par heure</span>
          <span className="font-medium">{pricePerPersonPerHour.toFixed(2)}€</span>
        </div>
        
        <div className="text-xs text-violet-600/80 pt-1">
          Pour {groupSize} personne{parseInt(groupSize) > 1 ? 's' : ''}, {duration} heure{parseInt(duration) > 1 ? 's' : ''} de karaoké
        </div>
      </CardContent>
    </Card>
  );
};