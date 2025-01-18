import { UseFormReturn } from "react-hook-form";
import { GroupSizeSelector } from "@/components/booking/group-size/GroupSizeSelector";
import { DurationSelector } from "@/components/booking/duration/DurationSelector";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingPrice } from "./booking/hooks/useBookingPrice";
import { BookingPriceDisplay } from "./booking/price/BookingPriceDisplay";

export interface GroupSizeAndDurationFieldsProps {
  form: UseFormReturn<any>;
  onGroupSizeChange: (size: string) => void;
  onDurationChange: (duration: string) => void;
  onPriceCalculated: (price: number) => void;
  availableHours: number;
  groupSize: string;
  duration: string;
}

export const GroupSizeAndDurationFields = ({
  form,
  onGroupSizeChange,
  onDurationChange,
  onPriceCalculated,
  availableHours,
  groupSize,
  duration,
}: GroupSizeAndDurationFieldsProps) => {
  const date = form.watch("date");
  const timeSlot = form.watch("timeSlot");

  const {
    currentPrice,
    pricePerPerson,
    hasDiscount,
    updatePrices
  } = useBookingPrice(form, onPriceCalculated);

  useEffect(() => {
    if (groupSize && duration) {
      console.log('🔄 Paramètres de prix actuels:', {
        groupSize,
        duration,
        date,
        timeSlot,
        dateType: date ? date.constructor.name : 'undefined',
        dateValue: date ? date.toISOString() : 'undefined'
      });

      const formattedDate = date ? new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : undefined;
      
      if (!formattedDate || !timeSlot) {
        console.warn('⚠️ Date ou créneau manquant pour le calcul du prix:', {
          formattedDate,
          timeSlot,
          date
        });
      }
      
      updatePrices(groupSize, duration, formattedDate, timeSlot);
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