import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onClose: () => void;
  isPending: boolean;
}

export const DialogActions = ({ onClose, isPending }: DialogActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onClose}>
        Annuler
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
};