import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useUserSearch = (form: any) => {
  const [isSearching, setIsSearching] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const { toast } = useToast();

  const searchUser = async (searchEmail: string) => {
    if (!searchEmail?.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un email",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // First try to find in profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', searchEmail.trim())
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        form.setValue("email", profileData.email || "", { shouldDirty: false });
        form.setValue("fullName", `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(), { shouldDirty: false });
        form.setValue("phone", profileData.phone || "", { shouldDirty: false });
        setUserFound(true);
        
        toast({
          title: "Utilisateur trouvé",
          description: "Les informations ont été remplies automatiquement",
        });
        return;
      }

      // If not found in profiles, try bookings
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('user_name, user_phone, user_email')
        .eq('user_email', searchEmail.trim())
        .maybeSingle();

      if (bookingError) throw bookingError;

      if (bookingData) {
        form.setValue("email", bookingData.user_email, { shouldDirty: false });
        form.setValue("fullName", bookingData.user_name, { shouldDirty: false });
        form.setValue("phone", bookingData.user_phone, { shouldDirty: false });
        setUserFound(true);
        
        toast({
          title: "Utilisateur trouvé",
          description: "Les informations ont été remplies automatiquement",
        });
      } else {
        toast({
          title: "Utilisateur non trouvé",
          description: "Aucun utilisateur trouvé avec cet email",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error searching user:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isSearching,
    userFound,
    searchUser
  };
};