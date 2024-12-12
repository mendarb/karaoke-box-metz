import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import { useBookingActions } from "@/hooks/useBookingActions";
import { BookingStatus } from "@/integrations/supabase/types/booking";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BookingActionsProps {
  bookingId: string;
  currentStatus: BookingStatus;
}

export const BookingActions = ({ bookingId, currentStatus }: BookingActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { updateBookingStatus, deleteBooking, isLoading } = useBookingActions();

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBooking(bookingId);
      setShowDeleteDialog(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting booking:', error);
      // Make sure to close dialogs even if there's an error
      setShowDeleteDialog(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <span className="sr-only">Menu</span>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {currentStatus !== 'confirmed' && (
            <DropdownMenuItem 
              onClick={() => handleStatusChange('confirmed')}
              className="cursor-pointer"
              disabled={isLoading}
            >
              Confirmer
            </DropdownMenuItem>
          )}
          {currentStatus !== 'cancelled' && (
            <DropdownMenuItem 
              onClick={() => handleStatusChange('cancelled')}
              className="cursor-pointer text-red-600 focus:text-red-600"
              disabled={isLoading}
            >
              Annuler
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-red-600 focus:text-red-600"
            disabled={isLoading}
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog 
        open={showDeleteDialog} 
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) setIsOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La réservation sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};