import { UseFormReturn } from "react-hook-form";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { DateTimeFields } from "./DateTimeFields";
import { GroupSizeAndDurationFields } from "./GroupSizeAndDurationFields";
import { AdditionalFields } from "./AdditionalFields";
import { CabinSelection } from "./CabinSelection";

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
  isAuthenticated: boolean;
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
  isAuthenticated,
}: BookingFormContentProps) => {
  if (currentStep === 1 && isAuthenticated) {
    return <CabinSelection form={form} />;
  }

  switch (currentStep) {
    case 1:
      return <PersonalInfoFields form={form} />;
    case 2:
      return <CabinSelection form={form} />;
    case 3:
      return <DateTimeFields 
        form={form} 
        onAvailabilityChange={onAvailabilityChange}
      />;
    case 4:
      return (
        <GroupSizeAndDurationFields
          form={form}
          onGroupSizeChange={onGroupSizeChange}
          onDurationChange={onDurationChange}
          onPriceCalculated={onPriceCalculated}
          availableHours={availableHours}
        />
      );
    case 5:
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