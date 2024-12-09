import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingStatusBadge } from "../admin/BookingStatusBadge";
import { Loader2 } from "lucide-react";

export const BookingHistory = () => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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

  const downloadInvoice = async (booking: any) => {
    // TODO: Implement invoice download
    console.log('Téléchargement de la facture pour la réservation:', booking.id);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Mes réservations</h2>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr })}
                </h3>
                <p className="text-gray-600">
                  {booking.time_slot}h - {parseInt(booking.time_slot) + parseInt(booking.duration)}h
                </p>
              </div>
              <BookingStatusBadge status={booking.status} />
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

            {booking.payment_status === 'paid' && (
              <Button
                variant="outline"
                onClick={() => downloadInvoice(booking)}
                className="w-full"
              >
                Télécharger la facture
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};