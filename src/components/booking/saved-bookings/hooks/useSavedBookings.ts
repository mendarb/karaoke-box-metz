import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export interface SavedBooking {
  id: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  message?: string;
  is_available?: boolean;
}

export const useSavedBookings = (isOpen: boolean) => {
  const [savedBookings, setSavedBookings] = useState<SavedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadSavedBookings = async () => {
    try {
      setIsLoading(true);
      const { data: bookings, error } = await supabase
        .from("saved_bookings")
        .select("*")
        .is("deleted_at", null);

      if (error) throw error;

      if (bookings) {
        const bookingsWithAvailability = await Promise.all(
          bookings.map(async (booking) => {
            const { data: existingBookings } = await supabase
              .from("bookings")
              .select("*")
              .eq("date", booking.date)
              .eq("time_slot", booking.time_slot)
              .neq("status", "cancelled")
              .is("deleted_at", null);

            return {
              ...booking,
              is_available: !existingBookings?.length,
            };
          })
        );

        setSavedBookings(bookingsWithAvailability);
        
        if (bookingsWithAvailability.length > 0) {
          toast({
            title: "💡 Réservations sauvegardées",
            description: "Cliquez sur 'Continuer la réservation' pour finaliser",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
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
    if (isOpen) {
      loadSavedBookings();
    }
  }, [isOpen]);

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
      console.error("Erreur lors de la suppression:", error);
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