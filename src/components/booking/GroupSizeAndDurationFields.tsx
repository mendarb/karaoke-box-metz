import { UseFormReturn } from "react-hook-form";
import { useCalculatePrice } from "@/components/price-calculator/useCalculatePrice";
import { usePriceSettings } from "@/components/price-calculator/usePriceSettings";
import { GroupSizeSelector } from "./group-size/GroupSizeSelector";
import { DurationSelector } from "./duration/DurationSelector";
import { PriceDisplay } from "@/components/price-calculator/PriceDisplay";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface GroupSizeAndDurationFieldsProps {
  form: UseFormReturn<any>;
  onGroupSizeChange: (size: string) => void;
  onDurationChange: (duration: string) => void;
  onPriceCalculated: (price: number) => void;
  availableHours: number;
}

export const GroupSizeAndDurationFields = ({
  form,
  onGroupSizeChange,
  onDurationChange,
  onPriceCalculated,
  availableHours,
}: GroupSizeAndDurationFieldsProps) => {
  const { data: settings } = usePriceSettings();
  const { calculatePrice } = useCalculatePrice({ settings });
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [pricePerPerson, setPricePerPerson] = useState<number>(0);

  const groupSize = form.watch("groupSize");
  const duration = form.watch("duration");

  const updatePrices = (size: string, dur: string) => {
    if (size && dur) {
      const calculatedPrice = calculatePrice(size, dur);
      const pricePerPersonPerHour = calculatedPrice / (parseInt(size) * parseInt(dur));
      
      setCurrentPrice(calculatedPrice);
      setPricePerPerson(pricePerPersonPerHour);
      onPriceCalculated(calculatedPrice);
      
      console.log('💰 Prix calculé:', {
        groupSize: size,
        duration: dur,
        totalPrice: calculatedPrice,
        pricePerPerson: pricePerPersonPerHour
      });
    }
  };

  const handleGroupSizeChange = (value: string) => {
    form.setValue("groupSize", value);
    onGroupSizeChange(value);
    
    const currentDuration = form.getValues("duration");
    if (currentDuration) {
      updatePrices(value, currentDuration);
    }
  };

  const handleDurationChange = (value: string) => {
    form.setValue("duration", value);
    onDurationChange(value);
    
    const currentGroupSize = form.getValues("groupSize");
    if (currentGroupSize) {
      updatePrices(currentGroupSize, value);
    }
  };

  useEffect(() => {
    if (groupSize && duration) {
      updatePrices(groupSize, duration);
    }
  }, [groupSize, duration, settings]);

  return (
    <div className="space-y-6">
      <Card className="bg-white/50 backdrop-blur-sm border-none">
        <CardContent className="p-6 space-y-6">
          <GroupSizeSelector 
            form={form} 
            onGroupSizeChange={handleGroupSizeChange} 
          />
          <DurationSelector 
            form={form} 
            onDurationChange={handleDurationChange}
            availableHours={availableHours}
          />
          {groupSize && duration && currentPrice > 0 && (
            <div className="pt-4 border-t">
              <PriceDisplay
                price={currentPrice}
                pricePerPersonPerHour={pricePerPerson}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};