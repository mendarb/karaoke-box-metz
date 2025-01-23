import { UseFormReturn } from "react-hook-form";
import { DateTimeFields } from "./DateTimeFields";
import { GroupSizeAndDurationFields } from "./GroupSizeAndDurationFields";
import { AdditionalFields } from "./additional/AdditionalFields";
import { useEffect, useState } from "react";
import { useBookingPrice } from "./hooks/useBookingPrice";

export interface BookingFormContentProps {
  form: UseFormReturn<any>;
  currentStep: number;
  groupSize: string;
  duration: string;
  calculatedPrice: number;
  onGroupSizeChange: (size: string) => void;
  onDurationChange: (duration: string) => void;
  onPriceCalculated: (price: number) => void;
  onAvailabilityChange: (date: Date | undefined, hours: number) => void;
  availableHours: number;
  onLocationSelect: (location: any) => void;
}

export const BookingFormContent = ({
  form,
  currentStep,
  groupSize,
  duration,
  calculatedPrice,
  onGroupSizeChange,
  onDurationChange,
  onPriceCalculated,
  onAvailabilityChange,
  availableHours,
  onLocationSelect
}: BookingFormContentProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const {
    currentPrice,
    updatePrices
  } = useBookingPrice(form, onPriceCalculated);

  const handleDateTimeAvailability = (date: Date | undefined, hours: number) => {
    setSelectedDate(date);
    onAvailabilityChange(date, hours);
  };

  useEffect(() => {
    console.log('📅 BookingFormContent - Valeurs actuelles:', {
      date: selectedDate,
      timeSlot: form.getValues('timeSlot'),
      step: currentStep,
      duration: form.getValues('duration')
    });
  }, [selectedDate, form, currentStep]);

  return (
    <div className="space-y-8">
      {currentStep === 1 && (
        <DateTimeFields
          form={form}
          onAvailabilityChange={handleDateTimeAvailability}
        />
      )}

      {currentStep === 2 && (
        <GroupSizeAndDurationFields
          form={form}
          onGroupSizeChange={onGroupSizeChange}
          onDurationChange={onDurationChange}
          onPriceCalculated={onPriceCalculated}
          availableHours={availableHours}
        />
      )}

      {currentStep === 3 && calculatedPrice > 0 && (
        <AdditionalFields
          form={form}
          calculatedPrice={calculatedPrice}
          groupSize={groupSize}
          duration={duration}
        />
      )}
    </div>
  );
};