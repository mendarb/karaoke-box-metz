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

      console.log('Price settings:', data?.value);
      return data?.value || { perHour: 30, perPerson: 5 };
    }
  });

  useEffect(() => {
    const calculatePrice = () => {
      if (!settings) return;
      
      console.log('Calculating price with:', { groupSize, duration, settings });
      
      const hours = parseInt(duration) || 0;
      const size = groupSize === "6+" ? 6 : parseInt(groupSize) || 0;

      console.log('Parsed values:', { hours, size });

      // Base price calculation using settings
      const basePrice = settings.perHour + (size * settings.perPerson);
      console.log('Base price:', basePrice);

      // Calculate total with discounts
      let totalPrice = basePrice;
      let totalDiscount = 0;

      if (hours > 1) {
        for (let i = 1; i < hours; i++) {
          const discountedHourPrice = basePrice * 0.9;
          totalPrice += discountedHourPrice;
          totalDiscount += basePrice * 0.1;
        }
      }

      const finalPrice = Math.round(totalPrice);
      const finalDiscount = Math.round(totalDiscount);
      const discountPercent = hours > 1 
        ? Math.round((totalDiscount / (basePrice * hours)) * 100)
        : 0;

      console.log('Final calculation:', { finalPrice, finalDiscount, discountPercent });

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