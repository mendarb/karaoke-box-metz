import { useEffect, useRef } from "react";
import { LocationSelector } from "./location/LocationSelector";
import { DateTimeFields } from "./date-time/DateTimeFields";
import { GroupSizeAndDurationFields } from "@/components/GroupSizeAndDurationFields";
import { AdditionalFields } from "./additional/AdditionalFields";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingFormContentProps {
  currentStep: number;
  form: any;
  groupSize: string;
  duration: string;
  calculatedPrice: number;
  onGroupSizeChange: (size: string) => void;
  onDurationChange: (duration: string) => void;
  onPriceCalculated: (price: number) => void;
  onAvailabilityChange: (isAvailable: boolean) => void;
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
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && contentRef.current) {
      const yOffset = -20; // Ajustement pour laisser un peu d'espace en haut
      const element = contentRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    }
  }, [currentStep, isMobile]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <LocationSelector 
            onSelect={onLocationSelect || (() => {})} 
          />
        );
      case 2:
        return (
          <DateTimeFields
            form={form}
            onAvailabilityChange={onAvailabilityChange}
          />
        );
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={contentRef}
      className="space-y-6 animate-fade-in"
    >
      {renderStepContent()}
    </div>
  );
};