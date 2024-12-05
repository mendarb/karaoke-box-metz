import { useEffect, useState } from "react";

interface PriceCalculatorProps {
  groupSize: string;
  duration: string;
}

export const PriceCalculator = ({ groupSize, duration }: PriceCalculatorProps) => {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const calculatePrice = () => {
      const hours = parseInt(duration) || 0;
      let basePrice = 0;

      switch (groupSize) {
        case "1-3":
          basePrice = 30;
          break;
        case "4":
          basePrice = 40;
          break;
        case "5-10":
          basePrice = 50;
          break;
        default:
          basePrice = 0;
      }

      setPrice(basePrice * hours);
    };

    calculatePrice();
  }, [groupSize, duration]);

  return (
    <div className="mt-4 p-4 bg-violet-50 rounded-lg animate-fadeIn">
      <p className="text-lg font-semibold text-karaoke-primary">
        Prix total estimé : {price}€
      </p>
      <p className="text-sm text-gray-600">
        *Prix indicatif, peut varier selon les options
      </p>
    </div>
  );
};