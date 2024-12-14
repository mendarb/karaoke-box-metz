import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

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
  const [formData, setFormData] = useState({
    code: promoCode?.code || '',
    description: promoCode?.description || '',
    type: promoCode?.type || 'percentage',
    value: promoCode?.value || '',
    max_uses: promoCode?.max_uses || '',
    start_date: promoCode?.start_date || '',
    end_date: promoCode?.end_date || '',
    is_active: promoCode?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Pourcentage</SelectItem>
                <SelectItem value="fixed_amount">Montant fixe</SelectItem>
                <SelectItem value="free">Gratuit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type !== 'free' && (
            <div className="space-y-2">
              <Label htmlFor="value">
                {formData.type === 'percentage' ? 'Pourcentage' : 'Montant (€)'}
              </Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
                min="0"
                step={formData.type === 'percentage' ? "1" : "0.01"}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="max_uses">Nombre maximum d'utilisations</Label>
            <Input
              id="max_uses"
              type="number"
              value={formData.max_uses}
              onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
              min="0"
              placeholder="Illimité"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_date">Date de début</Label>
            <Input
              id="start_date"
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">Date de fin</Label>
            <Input
              id="end_date"
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Actif</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};