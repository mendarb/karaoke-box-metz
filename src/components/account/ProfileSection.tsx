import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUserState } from "@/hooks/useUserState";
import { ProfileForm } from "./ProfileForm";
import { useProfileData } from "@/hooks/useProfileData";
import { updateProfile } from "@/services/profileService";

export const ProfileSection = () => {
  const { user } = useUserState();
  const { toast } = useToast();
  const { isLoading, setIsLoading, initialData, setInitialData } = useProfileData(user);

  const onSubmit = async (data: any) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('Updating profile with data:', data);
      
      const updatedProfile = await updateProfile(user.id, data);

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });

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