import { DateTimeSection } from "./summary/DateTimeSection";
import { GroupSection } from "./summary/GroupSection";
import { PriceSection } from "./summary/PriceSection";
import { MessageSection } from "./summary/MessageSection";

interface BookingSummaryProps {
  groupSize: string;
  duration: string;
  calculatedPrice: number;
  isPromoValid: boolean;
  promoCode?: string;
  finalPrice?: number;
  date?: string;
  timeSlot?: string;
  message?: string;
}

export const BookingSummary = ({
  groupSize,
  duration,
  calculatedPrice,
  isPromoValid,
  promoCode,
  finalPrice,
  date,
  timeSlot,
  message
}: BookingSummaryProps) => {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100 space-y-4">
      <h3 className="font-semibold text-violet-900">Récapitulatif de votre réservation</h3>
      
      <div className="space-y-4">
        {date && timeSlot && (
          <DateTimeSection 
            date={date} 
            timeSlot={timeSlot} 
            duration={duration} 
          />
        )}

        <GroupSection groupSize={groupSize} />

        <PriceSection 
          calculatedPrice={calculatedPrice}
          finalPrice={finalPrice}
          isPromoValid={isPromoValid}
          promoCode={promoCode}
        />

        {message && <MessageSection message={message} />}
      </div>
    </div>
  );
};