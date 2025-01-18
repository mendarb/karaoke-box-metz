import { DateTimeFields } from "./date-time/DateTimeFields";
import { GroupSizeAndDurationFields } from "../GroupSizeAndDurationFields";
import { AdditionalFields } from "./additional/AdditionalFields";
import { BookingFormLegal } from "./BookingFormLegal";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "./types/bookingFormTypes";

interface BookingFormContentProps {
  currentStep: number;
  form: UseFormReturn<BookingFormValues>;
  groupSize: string;
  duration: string;
  calculatedPrice: number;
  onGroupSizeChange: (size: string) => void;
  onDurationChange: (duration: string) => void;
  onPriceCalculated: (price: number) => void;
  onAvailabilityChange: (date: Date | undefined, hours: number) => void;
  availableHours: number;
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
}: BookingFormContentProps) => {
  return (
    <div className="space-y-6">
      {currentStep === 1 && (
        <DateTimeFields
          form={form}
          onAvailabilityChange={onAvailabilityChange}
          availableHours={availableHours}
        />
      )}

      {currentStep === 2 && (
        <GroupSizeAndDurationFields
          form={form}
          groupSize={groupSize}
          duration={duration}
          onGroupSizeChange={onGroupSizeChange}
          onDurationChange={onDurationChange}
          onPriceCalculated={onPriceCalculated}
          availableHours={availableHours}
        />
      )}

      {currentStep === 3 && (
        <>
          <AdditionalFields
            form={form}
            calculatedPrice={calculatedPrice}
            groupSize={groupSize}
            duration={duration}
          />
          <BookingFormLegal form={form} />
        </>
      )}
    </div>
  );
};