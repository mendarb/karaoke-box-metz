import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useUserState } from "@/hooks/useUserState";
import { ProfileForm } from "./ProfileForm";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export const ProfileSection = () => {
  const { user, profile } = useUserState();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    email: user?.email || "",
    phone: "",
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Mettre à jour le profil
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
        })
        .eq('id', user.id);

      if (profileUpdateError) throw profileUpdateError;

      // Mettre à jour les réservations existantes avec les nouvelles informations
      const fullName = `${data.first_name} ${data.last_name}`.trim();
      const { error: bookingsUpdateError } = await supabase
        .from('bookings')
        .update({
          user_name: fullName,
          user_phone: data.phone,
        })
        .eq('user_id', user.id);

      if (bookingsUpdateError) throw bookingsUpdateError;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      console.log('Profile data loaded:', profile);
      setInitialData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: user?.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon profil</CardTitle>
        <CardDescription>
          Gérez vos informations personnelles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm
          initialData={initialData}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};