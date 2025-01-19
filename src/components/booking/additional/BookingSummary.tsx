import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";

interface BookingSummaryProps {
  date?: Date;
  timeSlot?: string;
  duration?: string;
  groupSize?: string;
  calculatedPrice: number;
  finalPrice?: number;
  isPromoValid?: boolean;
  promoCode?: string;
  message?: string;
}

export const BookingSummary = ({
  date,
  timeSlot,
  duration,
  groupSize,
  calculatedPrice,
  finalPrice,
  isPromoValid,
  promoCode,
  message
}: BookingSummaryProps) => {
  const showDiscount = isPromoValid && finalPrice !== undefined && finalPrice !== calculatedPrice;
  const startHour = timeSlot ? parseInt(timeSlot) : undefined;
  const endHour = startHour !== undefined && duration ? startHour + parseInt(duration) : undefined;
  
  const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}h00`;

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Récapitulatif de votre réservation</h3>
        
        {date && (
          <p className="text-gray-600 mb-2">
            {format(date, "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        )}

        {startHour !== undefined && endHour !== undefined && duration && (
          <p className="text-gray-600 mb-2">
            {formatHour(startHour)} - {formatHour(endHour)} ({duration}h)
          </p>
        )}

        {groupSize && (
          <p className="text-gray-600 mb-4">
            {groupSize} personnes
          </p>
        )}

        {message && (
          <p className="text-gray-600 mb-4 italic">
            Message : {message}
          </p>
        )}

        <div className="border-t pt-4">
          {showDiscount && finalPrice !== undefined && (
            <>
              <p className="text-gray-500 line-through mb-1">
                Prix initial : {calculatedPrice}€
              </p>
              <p className="font-semibold text-green-600">
                Prix après réduction{promoCode ? ` (${promoCode})` : ''} : {finalPrice}€
              </p>
            </>
          )}
          {!showDiscount && (
            <p className="font-semibold">
              Prix total : {calculatedPrice}€
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};