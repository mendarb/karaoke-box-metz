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

interface DeleteBookingDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteBookingDialog = ({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: DeleteBookingDialogProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent onPointerDownOutside={(e) => {
        // Empêcher la propagation pour éviter le pointer-events: none
        e.preventDefault();
        if (!isLoading) {
          onClose();
        }
      }}>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. La réservation sera définitivement supprimée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={async (e) => {
              e.preventDefault();
              await onConfirm();
            }}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};