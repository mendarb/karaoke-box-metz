import { UseFormReturn } from "react-hook-form";
import { GroupSizeSelector } from "@/components/booking/group-size/GroupSizeSelector";
import { DurationSelector } from "@/components/booking/duration/DurationSelector";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingPrice } from "./booking/hooks/useBookingPrice";
import { BookingPriceDisplay } from "./booking/price/BookingPriceDisplay";

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
  const groupSize = form.watch("groupSize");
  const duration = form.watch("duration");
  const date = form.watch("date");
  const timeSlot = form.watch("timeSlot");

  const {
    currentPrice,
    pricePerPerson,
    hasDiscount,
    updatePrices
  } = useBookingPrice(form, onPriceCalculated);

  // Mise à jour du prix quand n'importe quel paramètre change
  useEffect(() => {
    if (groupSize && duration && date && timeSlot) {
      console.log('🔄 Mise à jour du prix (changement paramètres):', {
        groupSize,
        duration,
        date,
        timeSlot
      });
      updatePrices(groupSize, duration, date, timeSlot);
    }
  }, [groupSize, duration, date, timeSlot, updatePrices]);

  const handleGroupSizeChange = (value: string) => {
    form.setValue("groupSize", value);
    onGroupSizeChange(value);
  };

  const handleDurationChange = (value: string) => {
    form.setValue("duration", value);
    onDurationChange(value);
  };

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none">
      <CardContent className="space-y-6 p-6">
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
          <BookingPriceDisplay
            groupSize={groupSize}
            duration={duration}
            currentPrice={currentPrice}
            pricePerPerson={pricePerPerson}
            hasTimeDiscount={hasDiscount}
            form={form}
          />
        )}
      </CardContent>
    </Card>
  );
};