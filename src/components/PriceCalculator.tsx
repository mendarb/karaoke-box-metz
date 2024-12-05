import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "lucide-react";

interface PriceCalculatorProps {
  groupSize: string;
  duration: string;
}

export const PriceCalculator = ({ groupSize, duration }: PriceCalculatorProps) => {
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const calculatePrice = () => {
      const hours = parseInt(duration) || 0;
      let basePrice = 0;

      // Convert groupSize to number, handling "6+" case
      const size = groupSize === "6+" ? 6 : parseInt(groupSize) || 0;

      // Base price per hour based on group size
      if (size <= 3) {
        basePrice = 30; // 1-3 people: 30€/hour
      } else if (size === 4) {
        basePrice = 40; // 4 people: 40€/hour
      } else if (size >= 5 && size <= 10) {
        basePrice = 50; // 5-10 people: 50€/hour
      }

      // Calculate total price with discount for additional hours
      let totalPrice = basePrice; // First hour at full price
      let totalDiscount = 0;
      
      // Apply 10% discount for each additional hour
      if (hours > 1) {
        for (let i = 1; i < hours; i++) {
          const discountedPrice = basePrice * 0.9;
          totalPrice += discountedPrice;
          totalDiscount += basePrice * 0.1;
        }
      }

      // Calculate total discount percentage
      const discountPercent = hours > 1 
        ? Math.round((totalDiscount / (totalPrice + totalDiscount)) * 100)
        : 0;

      setPrice(Math.round(totalPrice));
      setDiscount(Math.round(totalDiscount));
      setDiscountPercentage(discountPercent);
    };

    calculatePrice();
  }, [groupSize, duration]);

  return (
    <div className={`${isMobile ? 'mt-3 p-4' : 'mt-4 p-6'} bg-violet-50 rounded-lg animate-fadeIn`}>
      <p className="text-xl sm:text-2xl font-semibold text-karaoke-primary mb-2">
        Prix total : {price}€
      </p>
      {discount > 0 && (
        <p className="text-sm text-green-600 font-medium mb-2 flex items-center gap-2">
          Économie réalisée : {discount}€ 
          <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs">
            -{discountPercentage}% au total
          </span>
        </p>
      )}
      <p className="text-xs sm:text-sm text-gray-600">
        *Prix indicatif, peut varier selon les options choisies
      </p>
    </div>
  );
};