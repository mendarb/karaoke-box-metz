import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";

interface BookingSummaryProps {
  groupSize?: string;
  duration?: string;
  calculatedPrice: number;
  finalPrice?: number;
  isPromoValid?: boolean;
  promoCode?: string;
  date?: Date;
  timeSlot?: string;
  message?: string;
}

export const BookingSummary = ({
  groupSize,
  duration,
  calculatedPrice,
  finalPrice,
  isPromoValid,
  promoCode,
  date,
  timeSlot,
  message
}: BookingSummaryProps) => {
  const showDiscount = isPromoValid && finalPrice !== undefined && finalPrice !== calculatedPrice;
  const startHour = timeSlot ? parseInt(timeSlot) : undefined;
  const endHour = startHour !== undefined && duration ? startHour + parseInt(duration) : undefined;
  
  const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}h00`;

  // Calculate price per person per hour, ensuring duration is properly parsed
  const pricePerPersonPerHour = groupSize && duration ? 
    Math.round((calculatedPrice / (parseInt(groupSize) * parseInt(duration))) * 100) / 100 : 
    0;

  console.log('💰 Prix par personne/heure:', {
    calculatedPrice,
    groupSize,
    duration,
    pricePerPersonPerHour,
    rawCalculation: calculatedPrice / (parseInt(groupSize || '1') * parseInt(duration || '1'))
  });

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
          <div className="space-y-1 mb-4">
            <p className="text-gray-600">
              {formatHour(startHour)} - {formatHour(endHour)}
            </p>
            <p className="text-gray-600">
              Durée : {duration} heure{parseInt(duration) > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {groupSize && (
          <div className="space-y-1 mb-4">
            <p className="text-gray-600">
              {groupSize} personne{parseInt(groupSize) > 1 ? 's' : ''}
            </p>
            <p className="text-gray-600">
              {pricePerPersonPerHour}€ par personne / heure
            </p>
          </div>
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