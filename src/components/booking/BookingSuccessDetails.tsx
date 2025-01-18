import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BookingDetails } from "@/hooks/useBookingSuccess";
import { Card } from "@/components/ui/card";

interface BookingSuccessDetailsProps {
  bookingDetails: BookingDetails;
}

export const BookingSuccessDetails = ({ bookingDetails }: BookingSuccessDetailsProps) => {
  const startHour = parseInt(bookingDetails.time_slot);
  const endHour = startHour + parseInt(bookingDetails.duration);
  const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

  const bookingDate = new Date(bookingDetails.date);
  // Add timezone offset to compensate for UTC conversion
  bookingDate.setMinutes(bookingDate.getMinutes() + bookingDate.getTimezoneOffset());

  return (
    <Card className="p-6 bg-gray-50 w-full">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {format(bookingDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatHour(startHour)} - {formatHour(endHour)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Personnes</p>
            <p className="font-medium">{bookingDetails.group_size}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Durée</p>
            <p className="font-medium">{bookingDetails.duration}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Prix</p>
            <p className="font-medium">{bookingDetails.price}€</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Paiement</p>
            <p className="font-medium">
              {bookingDetails.payment_status === 'paid' ? 'Payé' : 'En attente'}
            </p>
          </div>
        </div>

        {bookingDetails.is_test_booking && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              Ceci est une réservation de test. Aucun paiement réel n'a été effectué.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};