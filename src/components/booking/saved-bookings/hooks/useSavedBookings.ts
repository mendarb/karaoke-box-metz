import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useUserState } from "@/hooks/useUserState";

export interface SavedBooking {
  id: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  message?: string;
  is_available?: boolean;
  cabin: string;
}

export const useSavedBookings = (isOpen: boolean) => {
  const [savedBookings, setSavedBookings] = useState<SavedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUserState();

  const checkAvailability = async (booking: SavedBooking) => {
    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("date", booking.date)
      .neq("status", "cancelled")
      .is("deleted_at", null)
      .eq("payment_status", "paid");

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

    return { ...booking, is_available: isAvailable };
  };

  const loadSavedBookings = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data: bookings, error } = await supabase
        .from("saved_bookings")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (bookings) {
        const bookingsWithAvailability = await Promise.all(
          bookings.map(checkAvailability)
        );
        setSavedBookings(bookingsWithAvailability);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des réservations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos réservations sauvegardées",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      loadSavedBookings();
    }
  }, [isOpen, user]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_bookings")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setSavedBookings((prev) => prev.filter((booking) => booking.id !== id));
      
      toast({
        title: "Succès",
        description: "Réservation supprimée",
      });
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
        variant: "destructive",
      });
    }
  };

  return {
    savedBookings,
    isLoading,
    handleDelete,
  };
};