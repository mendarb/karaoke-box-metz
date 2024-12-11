import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', session.user.id)
          .order('date', { ascending: true });

        if (error) throw error;
        setBookings(data || []);
      } catch (error: any) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos réservations.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Mes réservations</h1>
      {bookings.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          Vous n'avez pas encore de réservation.
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr })}
                  </h3>
                  <p className="text-gray-600">
                    {booking.time_slot} - {booking.duration}h
                  </p>
                  <p className="text-gray-600">
                    {booking.group_size} personnes
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{booking.price}€</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status === 'confirmed' 
                      ? 'Confirmée'
                      : booking.status === 'cancelled'
                      ? 'Annulée'
                      : 'En attente'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};