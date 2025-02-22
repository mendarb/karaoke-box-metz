import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CookieConsentContent } from "./CookieConsentContent";

interface CookieConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onReject: () => void;
}

export const CookieConsentDialog = ({
  open,
  onOpenChange,
  onAccept,
  onReject,
}: CookieConsentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border-0">
        <DialogHeader>
          <DialogTitle className="text-xl">Paramètres de confidentialité</DialogTitle>
        </DialogHeader>
        
        <CookieConsentContent />

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={onReject}
            className="w-full sm:w-auto order-1 sm:order-none"
          >
            Refuser
          </Button>
          <Button
            onClick={onAccept}
            className="w-full sm:w-auto order-0 sm:order-none"
          >
            Tout accepter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};