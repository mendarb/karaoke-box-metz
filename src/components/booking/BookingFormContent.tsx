import { UseFormReturn } from "react-hook-form";
import { DateTimeFields } from "./date-time/DateTimeFields";
import { GroupSizeAndDurationFields } from "./GroupSizeAndDurationFields";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AdditionalFields } from "./additional/AdditionalFields";

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
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoFields
            form={form}
          />
        );
      case 2:
        return (
          <GroupSizeAndDurationFields
            form={form}
            onGroupSizeChange={onGroupSizeChange}
            onDurationChange={onDurationChange}
            onPriceCalculated={onPriceCalculated}
            availableHours={availableHours}
          />
        );
      case 3:
        return groupSize && duration ? (
          <DateTimeFields
            form={form}
            onAvailabilityChange={onAvailabilityChange}
            showTimeSlots={true}
            requiredDuration={parseInt(duration)}
          />
        ) : null;
      case 4:
        return (
          <AdditionalFields
            form={form}
            calculatedPrice={calculatedPrice}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {renderStep()}
    </div>
  );
};