import { UseFormReturn } from "react-hook-form";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { DateTimeFields } from "./DateTimeFields";
import { GroupSizeAndDurationFields } from "./GroupSizeAndDurationFields";
import { AdditionalFields } from "./AdditionalFields";
import { Card, CardContent } from "@/components/ui/card";

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
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoFields form={form} />;
      case 2:
        return (
          <DateTimeFields 
            form={form} 
            onAvailabilityChange={onAvailabilityChange}
            showTimeSlots={false}
          />
        );
      case 3:
        return (
          <DateTimeFields 
            form={form} 
            onAvailabilityChange={onAvailabilityChange}
            showTimeSlots={true}
          />
        );
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

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-none">
      <CardContent className="pt-6">
        <div className="min-h-[400px] max-h-[calc(100vh-300px)] overflow-y-auto animate-fadeIn">
          {renderStepContent()}
        </div>
      </CardContent>
    </Card>
  );
};