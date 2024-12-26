import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export const useProfileData = (user: User | null) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    email: user?.email || "",
    phone: "",
  });

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

  useEffect(() => {
    loadProfileData();
  }, [user, toast]);

  return {
    isLoading,
    setIsLoading,
    initialData,
    setInitialData,
  };
};