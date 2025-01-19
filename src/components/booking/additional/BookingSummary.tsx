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
  const startHour = timeSlot ? parseInt(timeSlot) : undefined;
  const endHour = startHour !== undefined ? startHour + Number(duration) : undefined;
  
  const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}h00`;
  
  return (
    <div className="bg-violet-50 p-4 rounded-lg space-y-4">
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
                {startHour !== undefined && endHour !== undefined && (
                  `${formatHour(startHour)} - ${formatHour(endHour)} (${duration}h)`
                )}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-violet-500" />
            <p>{groupSize} personnes</p>
          </div>
        </div>

        <div className="space-y-2">
          {showDiscount ? (
            <>
              <p className="line-through text-gray-500">Prix initial : {calculatedPrice}€</p>
              <div className="flex items-center space-x-2">
                <Euro className="h-4 w-4 text-green-500" />
                <p className="font-semibold text-green-600">Prix final : {finalPrice}€</p>
              </div>
              <p className="text-green-600 font-medium">Code promo {promoCode} appliqué</p>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Euro className="h-4 w-4 text-violet-500" />
              <p className="font-semibold">Prix total : {calculatedPrice}€</p>
            </div>
          )}
        </div>

        {message && (
          <div className="space-y-2">
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