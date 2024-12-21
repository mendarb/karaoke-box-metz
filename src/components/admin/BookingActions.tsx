import { useState } from "react";
import { useBookingActions } from "@/hooks/useBookingActions";
import { BookingStatus } from "@/integrations/supabase/types/booking";
import { DeleteBookingDialog } from "./actions/DeleteBookingDialog";
import { BookingActionsMenu } from "./actions/BookingActionsMenu";
import { useBookingEmail } from "@/hooks/useBookingEmail";
import { useToast } from "@/components/ui/use-toast";

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
  const { sendEmail } = useBookingEmail();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      const updatedBooking = await updateBookingStatus(bookingId, newStatus);
      
      // Envoyer un email si la réservation est confirmée
      if (newStatus === 'confirmed' && updatedBooking) {
        await sendEmail(updatedBooking);
      }
      
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
      await deleteBooking(bookingId);
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