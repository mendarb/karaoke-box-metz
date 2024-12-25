import { UseFormReturn } from "react-hook-form";
import { useCalculatePrice } from "@/components/price-calculator/useCalculatePrice";
import { usePriceSettings } from "@/components/price-calculator/usePriceSettings";
import { GroupSizeSelector } from "./group-size/GroupSizeSelector";
import { DurationSelector } from "./duration/DurationSelector";

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

  const handleGroupSizeChange = (value: string) => {
    form.setValue("groupSize", value);
    onGroupSizeChange(value);
    
    const duration = form.getValues("duration");
    if (duration) {
      const price = calculatePrice(value, duration);
      onPriceCalculated(price);
    }
  };

  const handleDurationChange = (value: string) => {
    form.setValue("duration", value);
    onDurationChange(value);
    
    const groupSize = form.getValues("groupSize");
    if (groupSize) {
      const price = calculatePrice(groupSize, value);
      onPriceCalculated(price);
    }
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
    </div>
  );
};