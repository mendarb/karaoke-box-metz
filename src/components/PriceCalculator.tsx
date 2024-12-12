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
  const [pricePerPersonPerHour, setPricePerPersonPerHour] = useState(0);
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

      const defaultSettings = { perHour: 30, perPerson: 5 };
      
      if (!data?.value) {
        console.log('No price settings found, using defaults:', defaultSettings);
        return defaultSettings;
      }

      console.log('Fetched price settings:', data.value);
      return data.value;
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

    const baseHourRate = typeof settings.perHour === 'string' 
      ? parseFloat(settings.perHour) 
      : settings.perHour || 30;
      
    const basePersonRate = typeof settings.perPerson === 'string' 
      ? parseFloat(settings.perPerson) 
      : settings.perPerson || 5;

    console.log('Base rates:', { baseHourRate, basePersonRate });

    const pricePerPerson = basePersonRate;
    const basePrice = baseHourRate + (pricePerPerson * size);
    let finalPrice = basePrice;

    if (hours > 1) {
      const additionalHours = hours - 1;
      const discountedHourPrice = basePrice * 0.9;
      finalPrice += discountedHourPrice * additionalHours;
    }

    const pricePerPersonHour = Math.round((basePrice / size) * 100) / 100;

    console.log('Price calculation:', {
      basePrice,
      finalPrice,
      pricePerPersonHour
    });

    setPrice(finalPrice);
    setPricePerPersonPerHour(pricePerPersonHour);

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
      <p className="text-xl sm:text-2xl font-bold text-violet-900">
        {formatPrice(pricePerPersonPerHour)}/pers/h
      </p>
      
      <p className="text-sm text-gray-600 mt-2">
        Total : {formatPrice(price)}
      </p>
    </div>
  );
};