import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BookingFormFields } from "../BookingFormFields";
import { PromoCodeField } from "@/components/booking/additional/PromoCodeField";
import { usePromoCode } from "@/components/booking/hooks/usePromoCode";
import { PriceDisplay } from "@/components/price-calculator/PriceDisplay";

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

  const groupSize = form.watch("groupSize");
  const duration = form.watch("duration");
  const calculatedPrice = form.watch("calculatedPrice");

  return (
    <div className="space-y-6">
      <BookingFormFields
        form={form}
        durations={durations}
        groupSizes={groupSizes}
        isLoading={isLoading}
        onPriceCalculated={onPriceCalculated}
      />

      {groupSize && duration && calculatedPrice > 0 && (
        <div className="bg-violet-50 rounded-lg p-4">
          <PriceDisplay
            groupSize={groupSize}
            duration={duration}
            price={calculatedPrice}
            finalPrice={calculatedPrice}
            pricePerPersonPerHour={calculatedPrice / (parseInt(groupSize) * parseInt(duration))}
          />
        </div>
      )}

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