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
  fullName: string;
  email: string;
  phone: string;
}

export const ProfileSection = () => {
  const { user } = useUserState();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<ProfileFormData>({
    fullName: "",
    email: user?.email || "",
    phone: "",
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Mettre à jour les métadonnées de l'utilisateur
      const { error: userUpdateError } = await supabase.auth.updateUser({
        data: {
          full_name: data.fullName,
          phone: data.phone,
        }
      });

      if (userUpdateError) throw userUpdateError;

      // Mettre à jour les réservations existantes avec les nouvelles informations
      const { error: bookingsUpdateError } = await supabase
        .from('bookings')
        .update({
          user_name: data.fullName,
          user_phone: data.phone,
        })
        .eq('user_id', user.id);

      if (bookingsUpdateError) throw bookingsUpdateError;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });

      // Recharger les données du profil
      loadProfileData();
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

  const loadProfileData = async () => {
    if (!user) return;

    try {
      // Récupérer les métadonnées de l'utilisateur
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser?.user_metadata) {
        setInitialData({
          fullName: currentUser.user_metadata.full_name || "",
          email: currentUser.email || "",
          phone: currentUser.user_metadata.phone || "",
        });
        return;
      }

      // Si pas de métadonnées, essayer de récupérer depuis la dernière réservation
      const { data: lastBooking } = await supabase
        .from('bookings')
        .select('user_name, user_phone')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastBooking) {
        setInitialData({
          fullName: lastBooking.user_name || "",
          email: user.email || "",
          phone: lastBooking.user_phone || "",
        });

        // Synchroniser avec les métadonnées utilisateur
        await supabase.auth.updateUser({
          data: {
            full_name: lastBooking.user_name,
            phone: lastBooking.user_phone,
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos informations",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [user]);

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