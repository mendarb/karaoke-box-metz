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
import { useToast } from "@/hooks/use-toast";

interface PromoCodePopupProps {
  onApplyCode: (code: string) => void;
  currentStep: number;
}

export const PromoCodePopup = ({ onApplyCode, currentStep }: PromoCodePopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentStep === 3) {
      const hasSeenPromo = localStorage.getItem("hasSeenPromoOuverture");
      if (!hasSeenPromo) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentStep]);

  const handleApplyCode = () => {
    try {
      onApplyCode("OUVERTURE");
      localStorage.setItem("hasSeenPromoOuverture", "true");
      setIsOpen(false);
      toast({
        title: "✨ Code promo appliqué",
        description: "Le code OUVERTURE a été appliqué avec succès",
      });
      console.log("🎫 Code promo OUVERTURE appliqué");
    } catch (error) {
      console.error("❌ Erreur lors de l'application du code promo:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'application du code promo",
        variant: "destructive",
      });
    }
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
            <Button onClick={handleApplyCode} className="bg-violet-600 hover:bg-violet-700">
              Appliquer le code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};