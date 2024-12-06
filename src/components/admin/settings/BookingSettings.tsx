import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SettingsCard } from "./SettingsCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const BookingSettings = () => {
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [minGroupSize, setMinGroupSize] = useState("1");
  const [maxGroupSize, setMaxGroupSize] = useState("10");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'booking_settings',
          value: {
            autoConfirm,
            minGroupSize: parseInt(minGroupSize),
            maxGroupSize: parseInt(maxGroupSize),
          }
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les paramètres ont été sauvegardés",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    }
  };

  return (
    <SettingsCard
      title="Paramètres des réservations"
      description="Configurez les règles de gestion des réservations"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-confirm">Confirmation automatique</Label>
          <Switch
            id="auto-confirm"
            checked={autoConfirm}
            onCheckedChange={setAutoConfirm}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="min-group">Taille minimum du groupe</Label>
          <Input
            id="min-group"
            type="number"
            value={minGroupSize}
            onChange={(e) => setMinGroupSize(e.target.value)}
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-group">Taille maximum du groupe</Label>
          <Input
            id="max-group"
            type="number"
            value={maxGroupSize}
            onChange={(e) => setMaxGroupSize(e.target.value)}
            min="1"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Sauvegarder
        </Button>
      </div>
    </SettingsCard>
  );
};