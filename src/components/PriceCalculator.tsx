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
      
      const hours = parseFloat(duration) || 0;
      const size = parseFloat(groupSize) || 0;
      
      if (hours === 0 || size === 0) {
        console.log('Invalid hours or size:', { hours, size });
        return;
      }

      // Parse settings values as numbers to ensure proper calculation
      const baseHourRate = parseFloat(settings.perHour);
      const basePersonRate = parseFloat(settings.perPerson);

      // Calculate base price for one hour
      const basePrice = baseHourRate + (size * basePersonRate);
      console.log('Base price per hour:', basePrice);

      // Calculate total price without discount
      const totalWithoutDiscount = basePrice * hours;
      console.log('Total without discount:', totalWithoutDiscount);

      let finalPrice = basePrice; // First hour at full price

      // If more than 1 hour, apply 10% discount to additional hours
      if (hours > 1) {
        const additionalHours = hours - 1;
        const discountedHourPrice = basePrice * 0.9;
        const additionalHoursPrice = discountedHourPrice * additionalHours;
        
        finalPrice = finalPrice + additionalHoursPrice;
        console.log('Price after discount:', finalPrice);
      }

      const totalDiscount = totalWithoutDiscount - finalPrice;

      console.log('Final calculation:', { 
        basePrice,
        finalPrice,
        totalDiscount,
        discountPercentage: hours > 1 ? 10 : 0
      });

      setPrice(finalPrice);
      setDiscount(totalDiscount);
      setDiscountPercentage(hours > 1 ? 10 : 0);
      
      if (onPriceCalculated) {
        onPriceCalculated(finalPrice);
      }
    };

    if (groupSize && duration && settings) {
      calculatePrice();
    }
  }, [groupSize, duration, settings, onPriceCalculated]);

  if (!price) return null;

  // Format price with French number formatting
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className={`${isMobile ? 'mt-3 p-4' : 'mt-4 p-6'} bg-gradient-to-br from-violet-50/50 to-violet-100/50 backdrop-blur-sm rounded-2xl border border-violet-100/50 shadow-lg animate-fadeIn`}>
      <p className="text-xl sm:text-2xl font-bold text-violet-900 mb-2">
        Prix total : {formatPrice(price)}
      </p>
      {discount > 0 && (
        <p className="text-sm text-green-600 font-medium mb-2 flex items-center gap-2">
          Économie : {formatPrice(discount)}
          <span className="bg-green-100/80 backdrop-blur-sm text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
            -{discountPercentage}%
          </span>
        </p>
      )}
    </div>
  );
};