import { UseFormReturn } from "react-hook-form";
import { LocationSelector } from "./location/LocationSelector";
import { DateTimeFields } from "./date-time/DateTimeFields";
import { GroupSizeAndDurationFields } from "@/components/GroupSizeAndDurationFields";
import { AdditionalFields } from "./additional/AdditionalFields";
import { BookingFormLegal } from "./BookingFormLegal";

interface BookingFormContentProps {
  currentStep: number;
  form: UseFormReturn<any>;
  groupSize: string;
  duration: string;
  calculatedPrice: number;
  onGroupSizeChange: (size: string) => void;
  onDurationChange: (duration: string) => void;
  onPriceCalculated: (price: number) => void;
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void;
  availableHours: number;
  onLocationSelect: (location: string) => void;
}

export const BookingFormContent = ({
  currentStep,
  form,
  groupSize,
  duration,
  calculatedPrice,
  onGroupSizeChange,
  onDurationChange,
  onPriceCalculated,
  onAvailabilityChange,
  availableHours,
  onLocationSelect,
}: BookingFormContentProps) => {
  const date = form.watch("date");
  const timeSlot = form.watch("timeSlot");
  const formDuration = form.watch("duration");

  console.log('📅 BookingFormContent - Valeurs actuelles:', {
    date,
    timeSlot,
    step: currentStep,
    duration: formDuration || duration // Utiliser la valeur du form en priorité
  });

  return (
    <div className="space-y-6">
      {currentStep === 1 && (
        <LocationSelector 
          onSelect={onLocationSelect}
        />
      )}

      {currentStep === 2 && (
        <DateTimeFields 
          form={form}
          onAvailabilityChange={onAvailabilityChange}
        />
      )}

      {currentStep === 3 && (
        <GroupSizeAndDurationFields
          form={form}
          onGroupSizeChange={onGroupSizeChange}
          onDurationChange={onDurationChange}
          onPriceCalculated={onPriceCalculated}
          availableHours={availableHours}
        />
      )}

      {currentStep === 4 && (
        <>
          <AdditionalFields 
            form={form}
            calculatedPrice={calculatedPrice}
            groupSize={groupSize}
            duration={formDuration || duration} // Utiliser la valeur du form en priorité
          />
          <BookingFormLegal form={form} />
        </>
      )}
    </div>
  );
};