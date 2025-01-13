import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Users, Euro, MessageSquare } from "lucide-react";

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
  const showDiscount = isPromoValid && finalPrice !== undefined && finalPrice !== calculatedPrice;
  const endHour = timeSlot ? parseInt(timeSlot) + parseInt(duration) : undefined;
  const discountPercentage = showDiscount && finalPrice 
    ? Math.round(((calculatedPrice - finalPrice) / calculatedPrice) * 100)
    : 0;
  
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100 space-y-4">
      <h3 className="font-semibold text-violet-900">Récapitulatif de votre réservation</h3>
      
      <div className="space-y-4">
        {date && timeSlot && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-violet-500" />
              <p className="font-medium">
                {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-violet-500" />
              <p>
                {timeSlot.padStart(2, '0')}h00 - {endHour?.toString().padStart(2, '0')}h00 ({duration}h)
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-violet-500" />
            <p className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center bg-gray-50 rounded-full px-3 py-1 text-sm">
                {groupSize} {parseInt(groupSize) > 1 ? "personnes" : "personne"}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {showDiscount ? (
            <>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center space-x-2">
                  <Euro className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="line-through text-gray-400 text-sm">{calculatedPrice}€</p>
                    <p className="font-semibold text-green-600">{finalPrice}€</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-green-600 text-sm font-medium">
                    Code promo {promoCode}
                  </span>
                  <span className="text-green-600 text-xs">
                    -{discountPercentage}% de réduction
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex items-center space-x-2">
                <Euro className="h-4 w-4 text-violet-500" />
                <p className="font-semibold">{calculatedPrice}€</p>
              </div>
            </div>
          )}
        </div>

        {message && (
          <div className="space-y-2 border-t border-gray-100 pt-3">
            <div className="flex items-start space-x-2">
              <MessageSquare className="h-4 w-4 text-violet-500 mt-1" />
              <div>
                <p className="font-medium text-sm text-gray-700">Message</p>
                <p className="text-gray-600">{message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};