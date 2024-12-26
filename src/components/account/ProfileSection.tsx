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
  const { user } = useUserState();
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
      console.log('Updating profile with data:', data);
      
      // Créer le profil s'il n'existe pas
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (!existingProfile) {
        // Créer un nouveau profil
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
          }]);

        if (createError) throw createError;
      } else {
        // Mettre à jour le profil existant
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
          })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }

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

      // Recharger les données du profil
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (updatedProfile) {
        setInitialData({
          first_name: updatedProfile.first_name || "",
          last_name: updatedProfile.last_name || "",
          email: user.email || "",
          phone: updatedProfile.phone || "",
        });
      }
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
    const loadProfileData = async () => {
      if (!user) return;

      try {
        console.log('Loading profile data for user:', user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error loading profile:', profileError);
          throw profileError;
        }

        console.log('Profile data loaded:', profileData);
        if (profileData) {
          setInitialData({
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            email: user.email || "",
            phone: profileData.phone || "",
          });
        }
      } catch (error) {
        console.error('Error in loadProfileData:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos informations",
          variant: "destructive",
        });
      }
    };

    loadProfileData();
  }, [user, toast]);

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