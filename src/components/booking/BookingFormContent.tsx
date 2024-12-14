import { UseFormReturn } from "react-hook-form";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { DateTimeFields } from "./DateTimeFields";
import { GroupSizeAndDurationFields } from "./GroupSizeAndDurationFields";
import { AdditionalFields } from "./AdditionalFields";

interface BookingFormContentProps {
  currentStep: number;
  form: UseFormReturn<any>;
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
  switch (currentStep) {
    case 1:
      return <PersonalInfoFields form={form} />;
    case 2:
      return <DateTimeFields 
        form={form} 
        onAvailabilityChange={onAvailabilityChange}
      />;
    case 3:
      return (
        <GroupSizeAndDurationFields
          form={form}
          onGroupSizeChange={onGroupSizeChange}
          onDurationChange={onDurationChange}
          onPriceCalculated={onPriceCalculated}
          availableHours={availableHours}
        />
      );
    case 4:
      return (
        <AdditionalFields 
          form={form} 
          calculatedPrice={calculatedPrice}
          groupSize={groupSize}
          duration={duration}
        />
      );
    default:
      return null;
  }
};