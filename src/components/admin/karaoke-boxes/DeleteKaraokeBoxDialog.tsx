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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type DeleteKaraokeBoxDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  box: any;
};

export const DeleteKaraokeBoxDialog = ({
  open,
  onOpenChange,
  box,
}: DeleteKaraokeBoxDialogProps) => {
  const queryClient = useQueryClient();

  const { mutate: deleteBox, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("karaoke_boxes")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", box.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["karaoke-boxes"] });
      toast.success("Box supprimée avec succès");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Une erreur est survenue lors de la suppression de la box");
      console.error("Error deleting box:", error);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. La box sera marquée comme
            supprimée et ne sera plus visible dans l'application.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteBox()} disabled={isPending}>
            {isPending ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};