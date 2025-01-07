import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { useUserState } from "@/hooks/useUserState";

export const SavedBookingsSection = () => {
  const [savedBookings, setSavedBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUserState();

  useEffect(() => {
    fetchSavedBookings();
  }, []);

  const fetchSavedBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_bookings')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Vérifier la disponibilité pour chaque réservation sauvegardée
      const bookingsWithAvailability = await Promise.all(
        data.map(async (booking) => {
          const { data: existingBookings } = await supabase
            .from('bookings')
            .select('*')
            .eq('date', booking.date)
            .neq('status', 'cancelled')
            .is('deleted_at', null);

          const isAvailable = !existingBookings?.some(existingBooking => {
            const savedStart = parseInt(booking.time_slot);
            const savedEnd = savedStart + parseInt(booking.duration);
            const existingStart = parseInt(existingBooking.time_slot);
            const existingEnd = existingStart + parseInt(existingBooking.duration);

            return (
              (savedStart >= existingStart && savedStart < existingEnd) ||
              (savedEnd > existingStart && savedEnd <= existingEnd) ||
              (savedStart <= existingStart && savedEnd >= existingEnd)
            );
          });

          return { ...booking, isAvailable };
        })
      );

      setSavedBookings(bookingsWithAvailability);
    } catch (error) {
      console.error('Error fetching saved bookings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos réservations sauvegardées",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueBooking = (booking: any) => {
    if (!booking.isAvailable) {
      toast({
        title: "Créneau indisponible",
        description: "Ce créneau n'est plus disponible. Veuillez en choisir un autre.",
        variant: "destructive",
      });
      return;
    }

    // Rediriger vers le formulaire de réservation avec les données pré-remplies
    navigate('/', {
      state: {
        savedBooking: {
          date: booking.date,
          timeSlot: booking.time_slot,
          duration: booking.duration,
          groupSize: booking.group_size,
          message: booking.message,
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_bookings')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Réservation supprimée",
        description: "La réservation sauvegardée a été supprimée",
      });

      fetchSavedBookings();
    } catch (error) {
      console.error('Error deleting saved booking:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="text-center p-8 text-gray-500">
        Connectez-vous pour voir vos réservations sauvegardées
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!savedBookings.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        Vous n'avez pas encore de réservations sauvegardées
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Réservations sauvegardées</h2>
      <div className="grid gap-4">
        {savedBookings.map((booking) => (
          <Card key={booking.id} className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="font-medium">
                  {format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr })}
                </div>
                <div className="text-gray-600">
                  {booking.time_slot}h - {parseInt(booking.time_slot) + parseInt(booking.duration)}h
                </div>
                <div className="text-sm text-gray-500">
                  {booking.group_size} personnes • {booking.duration}h
                </div>
                {!booking.isAvailable && (
                  <div className="flex items-center text-amber-600 text-sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Ce créneau n'est plus disponible
                  </div>
                )}
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 md:flex-none"
                  onClick={() => handleDelete(booking.id)}
                >
                  Supprimer
                </Button>
                <Button
                  variant={booking.isAvailable ? "default" : "secondary"}
                  className="flex-1 md:flex-none"
                  onClick={() => handleContinueBooking(booking)}
                  disabled={!booking.isAvailable}
                >
                  {booking.isAvailable ? "Continuer la réservation" : "Créneau indisponible"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};