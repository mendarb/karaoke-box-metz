import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { KaraokeBoxForm } from "./dialog/KaraokeBoxForm";
import { DialogActions } from "./dialog/DialogActions";
import { useKaraokeBoxForm } from "./dialog/useKaraokeBoxForm";

interface KaraokeBoxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  box?: any;
}

export const KaraokeBoxDialog = ({
  open,
  onOpenChange,
  box,
}: KaraokeBoxDialogProps) => {
  const { form, saveBox, isPending } = useKaraokeBoxForm(box, () => onOpenChange(false));

  const onSubmit = (values: any) => {
    saveBox(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {box ? "Modifier la box" : "Nouvelle box"}
          </DialogTitle>
          <DialogDescription>
            {box ? "Modifiez les informations de la box" : "Créez une nouvelle box karaoké"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <KaraokeBoxForm form={form} />
            <DialogActions onClose={() => onOpenChange(false)} isPending={isPending} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};