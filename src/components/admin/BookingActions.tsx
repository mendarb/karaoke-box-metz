import { useState } from "react";
import { useBookingActions } from "@/hooks/useBookingActions";
import { BookingStatus } from "@/integrations/supabase/types/booking";
import { DeleteBookingDialog } from "./actions/DeleteBookingDialog";
import { BookingActionsMenu } from "./actions/BookingActionsMenu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface BookingActionsProps {
  bookingId: string;
  currentStatus: BookingStatus;
}

export const BookingActions = ({ 
  bookingId, 
  currentStatus 
}: BookingActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { updateBookingStatus, deleteBooking, isLoading } = useBookingActions();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      // Marquer la réservation comme supprimée avec deleted_at
      const { error: deleteError } = await supabase
        .from('bookings')
        .update({ 
          deleted_at: new Date().toISOString(),
          status: 'cancelled'
        })
        .eq('id', bookingId);

      if (deleteError) throw deleteError;

      setShowDeleteDialog(false);
      toast({
        title: "Succès",
        description: "La réservation a été supprimée",
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <BookingActionsMenu
        isOpen={isOpen}
        isLoading={isLoading}
        currentStatus={currentStatus}
        onOpenChange={setIsOpen}
        onStatusChange={handleStatusChange}
        onDelete={() => setShowDeleteDialog(true)}
      />

      <DeleteBookingDialog
        isOpen={showDeleteDialog}
        isLoading={isLoading}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};