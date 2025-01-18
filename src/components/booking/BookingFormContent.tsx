import { UseFormReturn } from "react-hook-form";
import { DateTimeFields } from "./DateTimeFields";
import { GroupSizeAndDurationFields } from "@/components/GroupSizeAndDurationFields";
import { AdditionalFields } from "./AdditionalFields";
import { Card, CardContent } from "@/components/ui/card";
import { LocationSelector } from "./location/LocationSelector";

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
  onLocationSelect?: (location: string) => void;
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
  console.log('📅 BookingFormContent - Valeurs actuelles:', {
    date: form.watch('date'),
    timeSlot: form.watch('timeSlot'),
    step: currentStep
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="w-full">
            <LocationSelector 
              onSelect={(location) => onLocationSelect?.(location)} 
            />
          </div>
        );
      case 2:
        return (
          <div className="w-full">
            <DateTimeFields 
              form={form} 
              onAvailabilityChange={onAvailabilityChange}
            />
          </div>
        );
      case 3:
        return (
          <div className="w-full">
            <GroupSizeAndDurationFields
              form={form}
              onGroupSizeChange={onGroupSizeChange}
              onDurationChange={onDurationChange}
              onPriceCalculated={onPriceCalculated}
              availableHours={availableHours}
            />
          </div>
        );
      case 4:
        return (
          <div className="w-full">
            <AdditionalFields 
              form={form} 
              calculatedPrice={calculatedPrice}
              groupSize={groupSize}
              duration={duration}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-none w-full flex-1">
      <CardContent className="pt-6 w-full">
        <div className="min-h-[300px] animate-fadeIn w-full">
          {renderStepContent()}
        </div>
      </CardContent>
    </Card>
  );
};