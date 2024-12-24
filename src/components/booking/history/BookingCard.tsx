import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingStatusBadge } from "../../admin/BookingStatusBadge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, Users, Euro } from "lucide-react";

interface BookingCardProps {
  booking: any;
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const { toast } = useToast();
  const startHour = parseInt(booking.time_slot);
  const endHour = startHour + parseInt(booking.duration);

  const handleDownloadInvoice = async () => {
    try {
      console.log('Downloading invoice for booking:', booking);
      
      if (!booking.payment_intent_id) {
        console.error('No payment_intent_id available');
        throw new Error('Identifiant de paiement non disponible');
      }

      const { data, error } = await supabase.functions.invoke('get-invoice', {
        body: { 
          bookingId: booking.id,
          paymentIntentId: booking.payment_intent_id,
          isTestMode: booking.is_test_booking
        }
      });

      console.log('Invoice response:', { data, error });

      if (error) throw error;
      if (!data?.url) throw new Error('URL de facture non disponible');

      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      console.error('Error downloading invoice:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la facture. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="font-medium capitalize">
                {format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {`${booking.time_slot}:00 - ${endHour}:00`}
              </span>
            </div>
          </div>
          <BookingStatusBadge 
            status={booking.status} 
            paymentStatus={booking.payment_status}
            isTestBooking={booking.is_test_booking}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Personnes</p>
              <p className="font-medium">{booking.group_size}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Prix</p>
              <p className="font-medium">{booking.price}€</p>
            </div>
          </div>
        </div>

        {booking.is_test_booking && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              Ceci est une réservation de test. Aucun paiement réel n'a été effectué.
            </p>
          </div>
        )}

        {booking.payment_status === 'paid' && booking.payment_intent_id && !booking.is_test_booking && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDownloadInvoice}
          >
            Télécharger la facture
          </Button>
        )}
      </div>
    </Card>
  );
};