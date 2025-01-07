import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useUserState } from "@/hooks/useUserState";
import { SavedBookingCard } from "./saved-bookings/SavedBookingCard";
import { EmptyState } from "./saved-bookings/EmptyState";
import { LoadingState } from "./saved-bookings/LoadingState";
import { useBookingAvailability } from "./saved-bookings/useBookingAvailability";
import { SavedBooking } from "./saved-bookings/types";

export const SavedBookingsSection = () => {
  const [savedBookings, setSavedBookings] = useState<SavedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUserState();
  const { checkAvailability } = useBookingAvailability();

  useEffect(() => {
    if (user) {
      fetchSavedBookings();
    }
  }, [user]);

  const fetchSavedBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_bookings')
        .select('*')
        .eq('user_id', user?.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const bookingsWithAvailability = await checkAvailability(data);
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

  const handleContinueBooking = (booking: SavedBooking) => {
    if (!booking.isAvailable) {
      toast({
        title: "Créneau indisponible",
        description: "Ce créneau n'est plus disponible. Veuillez en choisir un autre.",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      date: booking.date,
      timeSlot: booking.time_slot,
      duration: booking.duration,
      groupSize: booking.group_size,
      message: booking.message || "",
      currentStep: 3,
      cabin: booking.cabin || 'metz'
    };

    sessionStorage.setItem("savedBooking", JSON.stringify(bookingData));

    navigate('/', {
      state: {
        savedBooking: bookingData,
        fromSavedBookings: true
      },
      replace: true
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

      setSavedBookings(prev => prev.filter(booking => booking.id !== id));
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
    return <LoadingState />;
  }

  if (!savedBookings.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Réservations sauvegardées</h2>
      <div className="grid gap-4">
        {savedBookings.map((booking) => (
          <SavedBookingCard
            key={booking.id}
            booking={booking}
            onDelete={handleDelete}
            onContinue={handleContinueBooking}
          />
        ))}
      </div>
    </div>
  );
};