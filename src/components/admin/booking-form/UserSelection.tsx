import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface UserSelectionProps {
  form: UseFormReturn<any>;
}

export const UserSelection = ({ form }: UserSelectionProps) => {
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [userFound, setUserFound] = useState(false);
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

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            className="pl-9"
            placeholder="Rechercher un utilisateur par email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchUser()}
            aria-label="Email de l'utilisateur"
          />
        </div>
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

      {userFound && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              {...form.register("email")}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet</label>
            <Input
              {...form.register("fullName")}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <Input
              {...form.register("phone")}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
      )}
    </div>
  );
};