import { UseFormReturn } from "react-hook-form";
import { useCalculatePrice } from "@/components/price-calculator/useCalculatePrice";
import { usePriceSettings } from "@/components/price-calculator/usePriceSettings";
import { GroupSizeSelector } from "@/components/booking/group-size/GroupSizeSelector";
import { DurationSelector } from "@/components/booking/duration/DurationSelector";
import { PriceDisplay } from "@/components/price-calculator/PriceDisplay";
import { useEffect } from "react";

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
  const { price, pricePerPersonPerHour, calculatePrice } = useCalculatePrice({ settings });

  const groupSize = form.watch("groupSize");
  const duration = form.watch("duration");

  useEffect(() => {
    if (groupSize && duration && settings) {
      const calculatedPrice = calculatePrice(groupSize, duration);
      onPriceCalculated(calculatedPrice);
    }
  }, [groupSize, duration, settings, calculatePrice, onPriceCalculated]);

  const handleGroupSizeChange = (value: string) => {
    form.setValue("groupSize", value);
    onGroupSizeChange(value);
  };

  const handleDurationChange = (value: string) => {
    form.setValue("duration", value);
    onDurationChange(value);
  };

  return (
    <div className="space-y-6">
      <GroupSizeSelector 
        form={form} 
        onGroupSizeChange={handleGroupSizeChange} 
      />
      <DurationSelector 
        form={form} 
        onDurationChange={handleDurationChange}
        availableHours={availableHours}
      />
      {groupSize && duration && (
        <PriceDisplay 
          price={price} 
          pricePerPersonPerHour={pricePerPersonPerHour} 
        />
      )}
    </div>
  );
};