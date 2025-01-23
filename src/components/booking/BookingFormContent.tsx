import { UseFormReturn } from "react-hook-form";
import { DateTimeFields } from "./DateTimeFields";
import { GroupSizeAndDurationFields } from "./GroupSizeAndDurationFields";
import { AdditionalFields } from "./additional/AdditionalFields";
import { useEffect, useState } from "react";
import { useBookingPrice } from "./hooks/useBookingPrice";

interface BookingFormContentProps {
  form: UseFormReturn<any>;
  step: number;
  onStepComplete: (step: number) => void;
}

export const BookingFormContent = ({
  form,
  step,
  onStepComplete,
}: BookingFormContentProps) => {
  const [availableHours, setAvailableHours] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  const {
    currentPrice,
    updatePrices
  } = useBookingPrice(form, setCalculatedPrice);

  const handleDateTimeAvailability = (date: Date | undefined, hours: number) => {
    setSelectedDate(date);
    setAvailableHours(hours);
  };

  const handleGroupSizeChange = (size: string) => {
    console.log('👥 Taille du groupe mise à jour:', size);
  };

  const handleDurationChange = (duration: string) => {
    console.log('⏱️ Durée mise à jour:', duration);
  };

  useEffect(() => {
    console.log('📅 BookingFormContent - Valeurs actuelles:', {
      date: selectedDate,
      timeSlot: form.getValues('timeSlot'),
      step,
      duration: form.getValues('duration')
    });
  }, [selectedDate, form, step]);

  return (
    <div className="space-y-8">
      {step === 1 && (
        <DateTimeFields
          form={form}
          onAvailabilityChange={handleDateTimeAvailability}
        />
      )}

      {step === 2 && (
        <GroupSizeAndDurationFields
          form={form}
          onGroupSizeChange={handleGroupSizeChange}
          onDurationChange={handleDurationChange}
          onPriceCalculated={setCalculatedPrice}
          availableHours={availableHours}
        />
      )}

      {step === 3 && calculatedPrice > 0 && (
        <AdditionalFields
          form={form}
          calculatedPrice={calculatedPrice}
          groupSize={form.getValues("groupSize")}
          duration={form.getValues("duration")}
        />
      )}
    </div>
  );
};