import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const EditAccountPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile', id],
    queryFn: async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profileError) throw profileError;

        // Get user email from the Edge Function
        const { data: emailsResponse, error: emailsError } = await supabase.functions.invoke(
          'get-user-emails'
        );

        if (emailsError) throw emailsError;

        const userEmails = emailsResponse.userEmails;

        return {
          ...profile,
          email: userEmails[profile.id]
        };
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    },
    enabled: !!id
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        phone: formData.get('phone'),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Les informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <p className="text-red-500">Profil non trouvé</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Modifier le profil</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  defaultValue={profile.first_name || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  defaultValue={profile.last_name || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={profile.phone || ''}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};