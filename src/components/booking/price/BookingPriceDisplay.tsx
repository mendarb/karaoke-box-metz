import { PriceDisplay } from "@/components/price-calculator/PriceDisplay";
import { PromoCodeField } from "@/components/price-calculator/PromoCodeField";
import { usePromoCode } from "@/components/price-calculator/usePromoCode";
import { UseFormReturn } from "react-hook-form";

interface BookingPriceDisplayProps {
  groupSize: string;
  duration: string;
  currentPrice: number;
  pricePerPerson: number;
  hasTimeDiscount: boolean;
  form: UseFormReturn<any>;
}

export const BookingPriceDisplay = ({
  groupSize,
  duration,
  currentPrice,
  pricePerPerson,
  hasTimeDiscount,
  form
}: BookingPriceDisplayProps) => {
  const {
    finalPrice,
    handlePromoValidated,
    isPromoValid,
    promoData
  } = usePromoCode(currentPrice, form);

  return (
    <>
      <PromoCodeField
        onPromoValidated={handlePromoValidated}
      />
      <PriceDisplay
        groupSize={groupSize}
        duration={duration}
        price={currentPrice}
        finalPrice={finalPrice}
        pricePerPersonPerHour={pricePerPerson}
        promoCode={promoData?.code}
        isPromoValid={isPromoValid}
        hasTimeDiscount={hasTimeDiscount}
      />
    </>
  );
};