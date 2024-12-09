import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface PriceCalculatorProps {
  groupSize: string;
  duration: string;
  onPriceCalculated?: (price: number) => void;
}

export const PriceCalculator = ({ groupSize, duration, onPriceCalculated }: PriceCalculatorProps) => {
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const isMobile = useIsMobile();

  const { data: settings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('key', 'base_price')
        .single();

      if (error) {
        console.error('Error fetching price settings:', error);
        throw error;
      }

      console.log('Fetched price settings:', data);
      return data?.value || { perHour: 30, perPerson: 5 };
    }
  });

  useEffect(() => {
    const calculatePrice = () => {
      if (!settings) {
        console.log('No settings available yet');
        return;
      }
      
      console.log('Calculating price with:', { groupSize, duration, settings });
      
      const hours = parseInt(duration) || 0;
      const size = parseInt(groupSize) || 0;
      
      if (hours === 0 || size === 0) {
        console.log('Invalid hours or size:', { hours, size });
        return;
      }

      // Base price calculation
      const basePrice = settings.perHour + (size * settings.perPerson);
      console.log('Base price:', basePrice);

      let totalPrice = 0;
      let totalDiscount = 0;

      // Calculate total price for all hours
      totalPrice = basePrice * hours;

      // Apply discount for additional hours
      if (hours > 1) {
        const regularPrice = basePrice * hours;
        const discountedPrice = basePrice + (basePrice * 0.9 * (hours - 1));
        totalDiscount = regularPrice - discountedPrice;
        totalPrice = discountedPrice;
      }

      const finalPrice = Math.round(totalPrice);
      const finalDiscount = Math.round(totalDiscount);
      const discountPercent = hours > 1 ? 10 : 0;

      console.log('Final calculation:', { 
        basePrice,
        totalPrice: finalPrice, 
        totalDiscount: finalDiscount, 
        discountPercent,
        hours,
        size
      });

      setPrice(finalPrice);
      setDiscount(finalDiscount);
      setDiscountPercentage(discountPercent);
      
      if (onPriceCalculated) {
        onPriceCalculated(finalPrice);
      }
    };

    if (groupSize && duration && settings) {
      calculatePrice();
    }
  }, [groupSize, duration, settings, onPriceCalculated]);

  if (!price) return null;

  return (
    <div className={`${isMobile ? 'mt-3 p-4' : 'mt-4 p-6'} bg-gradient-to-br from-violet-50/50 to-violet-100/50 backdrop-blur-sm rounded-2xl border border-violet-100/50 shadow-lg animate-fadeIn`}>
      <p className="text-xl sm:text-2xl font-bold text-violet-900 mb-2">
        Prix total : {price}€
      </p>
      {discount > 0 && (
        <p className="text-sm text-green-600 font-medium mb-2 flex items-center gap-2">
          Économie : {discount}€ 
          <span className="bg-green-100/80 backdrop-blur-sm text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
            -{discountPercentage}%
          </span>
        </p>
      )}
    </div>
  );
};