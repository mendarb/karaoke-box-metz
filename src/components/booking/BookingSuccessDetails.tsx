import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Booking } from "@/integrations/supabase/types/booking";

interface BookingSuccessDetailsProps {
  bookingDetails: Booking & { is_test_booking?: boolean };
}

export const BookingSuccessDetails = ({ bookingDetails }: BookingSuccessDetailsProps) => {
  const startHour = parseInt(bookingDetails.time_slot);
  const endHour = startHour + parseInt(bookingDetails.duration);

  return (
    <Card className="p-6 bg-gray-50">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {format(new Date(bookingDetails.date), 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>
          <p className="text-sm text-muted-foreground">
            {`${bookingDetails.time_slot}:00 - ${endHour}:00`}
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