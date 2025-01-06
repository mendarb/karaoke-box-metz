import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

interface PromoCodePopupProps {
  onApplyCode: (code: string) => void;
}

export const PromoCodePopup = ({ onApplyCode }: PromoCodePopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Afficher la popup après un court délai
    const timer = setTimeout(() => {
      const hasSeenPromo = localStorage.getItem("hasSeenPromoOuverture");
      if (!hasSeenPromo) {
        setIsOpen(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleApplyCode = () => {
    onApplyCode("OUVERTURE");
    localStorage.setItem("hasSeenPromoOuverture", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-violet-600" />
            Offre de lancement !
          </DialogTitle>
          <DialogDescription>
            Profitez de 10% de réduction sur votre première réservation avec le code <span className="font-semibold text-violet-600">OUVERTURE</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <p className="text-sm text-gray-500">
            Cette offre est valable jusqu'au 17 janvier 2024
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Plus tard
            </Button>
            <Button onClick={handleApplyCode}>
              Appliquer le code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};