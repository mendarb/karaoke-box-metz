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
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export const ProfileSection = () => {
  const { user } = useUserState();
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-none shadow-none bg-white/50">
      <CardHeader className="pb-4">
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
        <div className="mt-8 pt-6 border-t mb-8">
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};