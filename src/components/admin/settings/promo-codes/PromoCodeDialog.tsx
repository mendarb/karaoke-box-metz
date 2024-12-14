import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { PromoCodeForm } from "./PromoCodeForm";

interface PromoCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  promoCode?: any;
  onSuccess: () => void;
}

export const PromoCodeDialog = ({ 
  isOpen, 
  onClose, 
  promoCode,
  onSuccess 
}: PromoCodeDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    console.log('Submitting promo code data:', formData);

    try {
      const data = {
        ...formData,
        value: formData.type === 'free' ? null : parseFloat(formData.value),
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      };

      if (promoCode) {
        const { error } = await supabase
          .from('promo_codes')
          .update(data)
          .eq('id', promoCode.id);

        if (error) throw error;

        toast({
          title: "Code promo modifié",
          description: "Le code promo a été mis à jour avec succès.",
        });
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Code promo créé",
          description: "Le code promo a été créé avec succès.",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du code promo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {promoCode ? 'Modifier le code promo' : 'Ajouter un code promo'}
          </DialogTitle>
        </DialogHeader>

        <PromoCodeForm
          initialData={promoCode}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};