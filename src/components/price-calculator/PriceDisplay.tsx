import { useCalculatePrice } from "./useCalculatePrice";
import { Euro } from "lucide-react";

interface PriceDisplayProps {
  groupSize: string;
  duration: string;
  onPriceCalculated?: (price: number) => void;
}

export const PriceDisplay = ({ groupSize, duration, onPriceCalculated }: PriceDisplayProps) => {
  const { price, basePrice, personPrice } = useCalculatePrice(groupSize, duration);

  if (!groupSize || !duration) {
    return (
      <div className="text-center text-gray-500">
        Sélectionnez le nombre de personnes et la durée pour voir le prix
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-gray-600">Prix de base ({duration}h)</div>
        <div>{basePrice}€</div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-gray-600">Prix par personne (x{groupSize})</div>
        <div>{personPrice}€</div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Euro className="w-5 h-5 text-violet-600" />
          <span className="font-semibold text-lg">Prix total</span>
        </div>
        <div className="text-xl font-bold text-violet-600">{price}€</div>
      </div>
    </div>
  );
};