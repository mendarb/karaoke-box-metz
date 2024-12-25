import { useIsMobile } from "@/hooks/use-mobile";

interface PriceDisplayProps {
  price: number;
  pricePerPersonPerHour: number;
}

export const PriceDisplay = ({ price, pricePerPersonPerHour }: PriceDisplayProps) => {
  const isMobile = useIsMobile();

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (price === 0) return null;

  return (
    <div className={`${isMobile ? 'mt-3 p-4' : 'mt-4 p-6'} bg-gradient-to-br from-violet-600/10 to-violet-600/20 backdrop-blur-sm rounded-2xl border border-violet-600/20 shadow-lg animate-fadeIn`}>
      <div className="flex flex-col items-center text-center">
        <p className="text-2xl sm:text-3xl font-bold text-violet-600 mb-1">
          {formatPrice(pricePerPersonPerHour)}
        </p>
        <p className="text-sm text-violet-600 font-medium">
          par personne et par heure
        </p>
        <p className="text-sm text-gray-600 mt-3 font-medium">
          Total : {formatPrice(price)}
        </p>
      </div>
    </div>
  );
};