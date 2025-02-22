import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AnnouncementsSettings = () => {
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  const { data: announcement, refetch } = useQuery({
    queryKey: ['announcement-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        setMessage(data.message);
        setIsActive(data.is_active);
      }
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (announcement) {
        await supabase
          .from('announcements')
          .update({ message, is_active: isActive })
          .eq('id', announcement.id);
      } else {
        await supabase
          .from('announcements')
          .insert([{ message, is_active: isActive }]);
      }
      
      toast({
        title: "Succès",
        description: "L'annonce a été mise à jour",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bannière d'annonce</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Entrez votre message..."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <label htmlFor="is-active" className="text-sm font-medium">
              Activer la bannière
            </label>
          </div>
          
          <Button type="submit">
            Enregistrer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};