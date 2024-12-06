import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SettingsCard } from "./SettingsCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'notification_settings',
          value: {
            emailNotifications,
            smsNotifications,
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
      title="Paramètres des notifications"
      description="Configurez les notifications pour les réservations"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notif">Notifications par email</Label>
          <Switch
            id="email-notif"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sms-notif">Notifications par SMS</Label>
          <Switch
            id="sms-notif"
            checked={smsNotifications}
            onCheckedChange={setSmsNotifications}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Sauvegarder
        </Button>
      </div>
    </SettingsCard>
  );
};