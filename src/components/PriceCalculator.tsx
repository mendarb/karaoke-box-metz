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

      return data?.value || { perHour: 30, perPerson: 5 };
    }
  });

  useEffect(() => {
    if (!settings || !groupSize || !duration) {
      console.log('Missing required data:', { settings, groupSize, duration });
      return;
    }

    const hours = parseFloat(duration);
    const size = parseFloat(groupSize);

    if (isNaN(hours) || isNaN(size) || hours <= 0 || size <= 0) {
      console.log('Invalid input values:', { hours, size });
      return;
    }

    const baseHourRate = parseFloat(settings.perHour);
    const basePersonRate = parseFloat(settings.perPerson);

    if (isNaN(baseHourRate) || isNaN(basePersonRate)) {
      console.error('Invalid base rates:', { baseHourRate, basePersonRate });
      return;
    }

    const basePrice = baseHourRate + (size * basePersonRate);
    const totalWithoutDiscount = basePrice * hours;
    let finalPrice = basePrice;

    if (hours > 1) {
      const additionalHours = hours - 1;
      const discountedHourPrice = basePrice * 0.9;
      finalPrice += discountedHourPrice * additionalHours;
    }

    const totalDiscount = totalWithoutDiscount - finalPrice;
    const calculatedDiscountPercentage = hours > 1 ? 10 : 0;

    console.log('Price calculation:', {
      basePrice,
      totalWithoutDiscount,
      finalPrice,
      totalDiscount,
      discountPercentage: calculatedDiscountPercentage
    });

    setPrice(finalPrice);
    setDiscount(totalDiscount);
    setDiscountPercentage(calculatedDiscountPercentage);

    if (onPriceCalculated) {
      onPriceCalculated(finalPrice);
    }
  }, [groupSize, duration, settings, onPriceCalculated]);

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