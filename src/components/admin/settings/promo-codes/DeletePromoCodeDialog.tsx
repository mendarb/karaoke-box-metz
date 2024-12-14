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

interface DeletePromoCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  promoCode: any;
  onSuccess: () => void;
}

export const DeletePromoCodeDialog = ({
  isOpen,
  onClose,
  promoCode,
  onSuccess,
}: DeletePromoCodeDialogProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', promoCode.id);

      if (error) throw error;

      toast({
        title: "Code promo supprimé",
        description: "Le code promo a été supprimé avec succès.",
      });

      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du code promo.",
        variant: "destructive",
      });
    }
  };

  if (!promoCode) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action supprimera le code promo "{promoCode.code}". Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};