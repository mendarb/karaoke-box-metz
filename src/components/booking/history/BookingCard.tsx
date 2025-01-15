import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingStatusBadge } from "../../admin/BookingStatusBadge";
import { Calendar, Clock, Users, Euro, Download, CreditCard } from "lucide-react";

interface BookingCardProps {
  booking: any;
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const startHour = parseInt(booking.time_slot);
  const endHour = startHour + parseInt(booking.duration);

  // Ensure we're working with a proper Date object
  const bookingDate = new Date(booking.date);
  // Add timezone offset to compensate for UTC conversion
  bookingDate.setMinutes(bookingDate.getMinutes() + bookingDate.getTimezoneOffset());

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'Carte bancaire';
      case 'cash':
        return 'Espèces';
      case 'transfer':
        return 'Virement';
      default:
        return method;
    }
  };

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-violet-500" />
            <span className="font-medium capitalize">
              {format(bookingDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </span>
          </div>
          <BookingStatusBadge 
            status={booking.status} 
            paymentStatus={booking.payment_status}
            isTestBooking={booking.is_test_booking}
          />
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 text-violet-500" />
          <span>{startHour}:00 - {endHour}:00</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {booking.group_size} {parseInt(booking.group_size) > 1 ? 'personnes' : 'personne'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-violet-500" />
            <span className="text-gray-600 dark:text-gray-400">{booking.price}€</span>
          </div>
        </div>

        {booking.payment_method && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CreditCard className="h-4 w-4 text-violet-500" />
            <span>{getPaymentMethodLabel(booking.payment_method)}</span>
          </div>
        )}

        {booking.is_test_booking && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-md p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Ceci est une réservation de test. Aucun paiement réel n'a été effectué.
            </p>
          </div>
        )}

        {booking.payment_status === 'paid' && booking.invoice_url && (
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.open(booking.invoice_url, '_blank', 'noopener,noreferrer');
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Télécharger {booking.is_test_booking ? 'la facture test' : 'le reçu'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};