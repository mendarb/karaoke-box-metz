import { Card } from "@/components/ui/card";

interface PriceDisplayProps {
  price: number;
  pricePerPersonPerHour: number;
}

export const PriceDisplay = ({ price, pricePerPersonPerHour }: PriceDisplayProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-medium text-gray-700">Prix total</span>
          <span className="text-2xl font-bold text-violet-600">{price}€</span>
        </div>
        <div className="flex items-baseline justify-between text-sm text-gray-500">
          <span>Prix par personne et par heure</span>
          <span>{pricePerPersonPerHour.toFixed(2)}€</span>
        </div>
      </div>
    </div>
  );
};