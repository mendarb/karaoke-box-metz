import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BookingSummaryProps {
  groupSize: string;
  duration: string;
  calculatedPrice: number;
  isPromoValid: boolean;
  promoCode?: string;
  finalPrice?: number;
  date?: string;
  timeSlot?: string;
}

export const BookingSummary = ({
  groupSize,
  duration,
  calculatedPrice,
  isPromoValid,
  promoCode,
  finalPrice,
  date,
  timeSlot
}: BookingSummaryProps) => {
  const showDiscount = isPromoValid && finalPrice !== undefined && finalPrice !== calculatedPrice;
  const endHour = timeSlot ? parseInt(timeSlot) + parseInt(duration) : undefined;
  
  return (
    <div className="bg-violet-50 p-4 rounded-lg space-y-3">
      <h3 className="font-semibold text-violet-900">Récapitulatif de votre réservation</h3>
      <div className="text-sm text-violet-700 space-y-2">
        {date && timeSlot && (
          <>
            <p className="font-medium">
              {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
            </p>
            <p>
              Horaire : {timeSlot}:00 - {endHour}:00
            </p>
          </>
        )}
        <div className="pt-2">
          <p>Nombre de personnes : {groupSize}</p>
          <p>Durée : {duration} heure{parseInt(duration) > 1 ? 's' : ''}</p>
        </div>
        <div className="pt-2">
          {showDiscount ? (
            <>
              <p className="line-through text-gray-500">Prix initial : {calculatedPrice}€</p>
              <p className="font-semibold text-green-600">Prix final : {finalPrice}€</p>
              <p className="text-green-600 font-medium">Code promo {promoCode} appliqué</p>
            </>
          ) : (
            <p className="font-semibold">Prix total : {calculatedPrice}€</p>
          )}
        </div>
      </div>
    </div>
  );
};