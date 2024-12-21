import { UseFormReturn } from "react-hook-form";
import { BookingFormFields } from "../BookingFormFields";
import { PriceCalculator } from "@/components/PriceCalculator";
import { Button } from "@/components/ui/button";

interface BookingDetailsProps {
  form: UseFormReturn<any>;
  durations: string[];
  groupSizes: string[];
  isLoading: boolean;
  onPriceCalculated: (price: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export const BookingDetails = ({
  form,
  durations,
  groupSizes,
  isLoading,
  onPriceCalculated,
  onBack,
  onNext,
}: BookingDetailsProps) => {
  const handleNext = () => {
    const requiredFields = ["date", "timeSlot", "duration", "groupSize"];
    const isValid = requiredFields.every(field => form.getValues(field));
    
    if (!isValid) {
      form.trigger(requiredFields);
      return;
    }
    
    onNext();
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        ← Retour au client
      </Button>

      <BookingFormFields
        form={form}
        durations={durations}
        groupSizes={groupSizes}
        isLoading={isLoading}
      />

      <div className="mt-6">
        <PriceCalculator
          groupSize={form.watch("groupSize")}
          duration={form.watch("duration")}
          onPriceCalculated={onPriceCalculated}
        />
      </div>

      <Button onClick={handleNext} className="w-full">
        Continuer
      </Button>
    </div>
  );
};