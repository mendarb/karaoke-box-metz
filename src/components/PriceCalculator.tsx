import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PriceCalculatorProps {
  groupSize: string;
  duration: string;
}

export const PriceCalculator = ({ groupSize, duration }: PriceCalculatorProps) => {
  const [price, setPrice] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const calculatePrice = () => {
      const hours = parseInt(duration) || 0;
      let basePrice = 0;

      // Convert groupSize to number, handling "6+" case
      const size = groupSize === "6+" ? 6 : parseInt(groupSize) || 0;

      // New pricing logic
      if (size <= 3) {
        basePrice = 30; // 1-3 people: 30€/hour
      } else if (size === 4) {
        basePrice = 40; // 4 people: 40€/hour
      } else if (size >= 5 && size <= 10) {
        basePrice = 50; // 5-10 people: 50€/hour
      }

      setPrice(basePrice * hours);
    };

    calculatePrice();
  }, [groupSize, duration]);

  return (
    <div className={`${isMobile ? 'mt-3 p-4' : 'mt-4 p-6'} bg-violet-50 rounded-lg animate-fadeIn`}>
      <p className="text-xl sm:text-2xl font-semibold text-karaoke-primary mb-2">
        Prix total estimé : {price}€
      </p>
      <p className="text-xs sm:text-sm text-gray-600">
        *Prix indicatif, peut varier selon les options choisies
      </p>
    </div>
  );
};