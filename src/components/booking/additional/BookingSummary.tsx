import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Users, Euro } from "lucide-react";

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
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <p className="font-medium">
                {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <p>
                Horaire : {timeSlot}:00 - {endHour}:00
              </p>
            </div>
          </>
        )}
        <div className="pt-2">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <p>Nombre de personnes : {groupSize}</p>
          </div>
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
            <div className="flex items-center space-x-2">
              <Euro className="h-4 w-4" />
              <p className="font-semibold">Prix total : {calculatedPrice}€</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};