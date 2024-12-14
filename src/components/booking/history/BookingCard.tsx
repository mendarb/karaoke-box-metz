import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingStatusBadge } from "../../admin/BookingStatusBadge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

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
          paymentIntentId: booking.payment_intent_id
        }
      });

      console.log('Invoice response:', { data, error });

      if (error) throw error;
      if (!data?.url) throw new Error('URL de facture non disponible');

      // Ouvrir l'URL de la facture dans un nouvel onglet
      window.open(data.url, '_blank');
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
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>
          <p className="text-gray-600">
            {`${booking.time_slot}:00 - ${endHour}:00`}
          </p>
        </div>
        <BookingStatusBadge 
          status={booking.status} 
          paymentStatus={booking.payment_status}
          isTestBooking={booking.is_test_booking}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Personnes</p>
          <p className="font-medium">{booking.group_size}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Durée</p>
          <p className="font-medium">{booking.duration}h</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Prix</p>
          <p className="font-medium">{booking.price}€</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Paiement</p>
          <p className="font-medium">
            {booking.payment_status === 'paid' ? 'Payé' : 'En attente'}
          </p>
        </div>
      </div>

      {booking.is_test_booking && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-sm text-yellow-800">
            Ceci est une réservation de test. Aucun paiement n'a été effectué.
          </p>
        </div>
      )}

      {booking.payment_status === 'paid' && booking.payment_intent_id && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleDownloadInvoice}
        >
          Télécharger la facture
        </Button>
      )}
    </Card>
  );
};