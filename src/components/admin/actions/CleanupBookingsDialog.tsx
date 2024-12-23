import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface CleanupBookingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CleanupBookingsDialog = ({
  isOpen,
  onClose,
}: CleanupBookingsDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCleanup = async () => {
    try {
      setIsLoading(true);
      console.log("🧹 Starting cleanup of all bookings...");

      const now = new Date().toISOString();
      const { error } = await supabase
        .from('bookings')
        .update({ deleted_at: now })
        .is('deleted_at', null);

      if (error) {
        console.error('❌ Error during cleanup:', error);
        throw error;
      }

      console.log('✅ Cleanup completed successfully');
      
      // Refresh the bookings data
      await queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      
      toast({
        title: "Nettoyage terminé",
        description: "Toutes les réservations ont été supprimées avec succès",
      });
      
      onClose();
    } catch (error: any) {
      console.error('❌ Error in cleanup process:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du nettoyage des réservations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nettoyer toutes les réservations</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer toutes les réservations ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCleanup}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Nettoyage...
              </>
            ) : (
              'Nettoyer'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};