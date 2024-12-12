import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SettingsCard } from "./SettingsCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export const NotificationSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'notification_settings')
        .single();

      if (error) {
        return { emailNotifications: true, smsNotifications: false };
      }

      return data?.value;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast({
        title: "Succès",
        description: "Les paramètres ont été sauvegardés",
      });
    },
    onError: (error) => {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    },
  });

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

        <Button 
          onClick={() => mutation.mutate()} 
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sauvegarde en cours...
            </>
          ) : (
            "Sauvegarder"
          )}
        </Button>
      </div>
    </SettingsCard>
  );
};