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
      console.log('🔄 Chargement des réservations sauvegardées...');
      
      const { data: bookings, error } = await supabase
        .from("saved_bookings")
        .select("*")
        .is("deleted_at", null);

      if (error) {
        console.error('❌ Erreur lors du chargement:', error);
        throw error;
      }

      if (bookings) {
        console.log('✅ Réservations chargées:', bookings);
        
        // Vérifier la disponibilité de chaque réservation
        const bookingsWithAvailability = await Promise.all(
          bookings.map(async (booking) => {
            const { data: existingBookings } = await supabase
              .from("bookings")
              .select("*")
              .eq("date", booking.date)
              .eq("time_slot", booking.time_slot)
              .neq("status", "cancelled")
              .is("deleted_at", null)
              .eq("payment_status", "paid");

            return {
              ...booking,
              is_available: !existingBookings?.length,
            };
          })
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
    if (isOpen) {
      loadSavedBookings();
    }
  }, [isOpen]);

  const handleDelete = async (id: string) => {
    try {
      console.log('🗑️ Suppression de la réservation:', id);
      
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