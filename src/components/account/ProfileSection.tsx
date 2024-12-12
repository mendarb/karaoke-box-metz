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
      const { error } = await supabase
        .from('bookings')
        .update({
          user_name: data.fullName,
          user_phone: data.phone,
        })
        .eq('user_id', user.id)
        .eq('user_email', user.email);

      if (error) throw error;

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
    const loadProfileData = async () => {
      if (!user) return;

      const { data: lastBooking } = await supabase
        .from('bookings')
        .select('user_name, user_phone')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (lastBooking) {
        setInitialData({
          fullName: lastBooking.user_name,
          email: user.email || "",
          phone: lastBooking.user_phone,
        });
      }
    };

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