import { UseFormReturn } from "react-hook-form";
import { useCalculatePrice } from "@/components/price-calculator/useCalculatePrice";
import { usePriceSettings } from "@/components/price-calculator/usePriceSettings";
import { GroupSizeSelector } from "@/components/booking/group-size/GroupSizeSelector";
import { DurationSelector } from "@/components/booking/duration/DurationSelector";
import { PriceCalculator } from "@/components/PriceCalculator";
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
  const { calculatePrice } = useCalculatePrice({ settings });

  const groupSize = form.watch("groupSize");
  const duration = form.watch("duration");

  const handleGroupSizeChange = (value: string) => {
    form.setValue("groupSize", value);
    onGroupSizeChange(value);
    
    const currentDuration = form.getValues("duration");
    if (currentDuration) {
      const price = calculatePrice(value, currentDuration);
      onPriceCalculated(price);
    }
  };

  const handleDurationChange = (value: string) => {
    form.setValue("duration", value);
    onDurationChange(value);
    
    const currentGroupSize = form.getValues("groupSize");
    if (currentGroupSize) {
      const price = calculatePrice(currentGroupSize, value);
      onPriceCalculated(price);
    }
  };

  useEffect(() => {
    if (groupSize && duration && settings) {
      const price = calculatePrice(groupSize, duration);
      onPriceCalculated(price);
    }
  }, [groupSize, duration, settings, calculatePrice, onPriceCalculated]);

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
        <PriceCalculator
          groupSize={groupSize}
          duration={duration}
          onPriceCalculated={onPriceCalculated}
        />
      )}
    </div>
  );
};