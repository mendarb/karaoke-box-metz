import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface UserSelectionProps {
  form: UseFormReturn<any>;
}

export const UserSelection = ({ form }: UserSelectionProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const { toast } = useToast();

  const searchUser = async () => {
    if (!searchEmail.trim()) {
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
        form.setValue("email", profileData.email || "");
        form.setValue("fullName", `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim());
        form.setValue("phone", profileData.phone || "");
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
        form.setValue("email", bookingData.user_email);
        form.setValue("fullName", bookingData.user_name);
        form.setValue("phone", bookingData.user_phone);
        toast({
          title: "Utilisateur trouvé",
          description: "Les informations ont été remplies automatiquement",
        });
      } else {
        toast({
          title: "Utilisateur non trouvé",
          description: "Un email sera envoyé pour créer un compte",
        });
      }
    } catch (error) {
      console.error('Error searching user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Rechercher un utilisateur par email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchUser()}
          aria-label="Email de l'utilisateur"
        />
        <Button 
          onClick={searchUser}
          disabled={isSearching || !searchEmail}
          aria-label={isSearching ? "Recherche en cours..." : "Rechercher l'utilisateur"}
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Rechercher"
          )}
        </Button>
      </div>
    </div>
  );
};