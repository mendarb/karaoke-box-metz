import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BookingFormFields } from "../BookingFormFields";
import { PromoCodeField } from "@/components/booking/additional/PromoCodeField";
import { usePromoCode } from "@/components/hooks/usePromoCode";

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
  const { handlePromoValidated } = usePromoCode(form.getValues("calculatedPrice"), form);

  return (
    <div className="space-y-6">
      <BookingFormFields
        form={form}
        durations={durations}
        groupSizes={groupSizes}
        isLoading={isLoading}
      />

      <PromoCodeField 
        onPromoValidated={handlePromoValidated}
        form={form}
      />

      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full"
        >
          Retour
        </Button>
        <Button 
          onClick={onNext}
          className="w-full"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};