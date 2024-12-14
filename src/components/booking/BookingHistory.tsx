import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingStatusBadge } from "../admin/BookingStatusBadge";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const BookingHistory = () => {
  const { toast } = useToast();
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', session.user.id)
        .is('deleted_at', null)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      return data;
    },
    refetchInterval: 5000,
  });

  const handleDownloadInvoice = async (bookingId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-invoice', {
        body: { bookingId }
      });

      if (error) throw error;
      if (!data.url) throw new Error('URL de facture non disponible');

      // Ouvrir l'URL de la facture dans un nouvel onglet
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la facture. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        Vous n'avez pas encore de réservations
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Mes réservations</h2>
      <div className="grid gap-4">
        {bookings.map((booking) => {
          const startHour = parseInt(booking.time_slot);
          const endHour = startHour + parseInt(booking.duration);
          
          return (
            <Card key={booking.id} className="p-6">
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

              {booking.payment_status === 'paid' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDownloadInvoice(booking.id)}
                >
                  Télécharger la facture
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};