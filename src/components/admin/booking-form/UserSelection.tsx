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
    setIsSearching(true);
    try {
      const { data: user, error } = await supabase.auth.admin.getUserByEmail(searchEmail);

      if (error) throw error;

      if (user) {
        form.setValue("email", user.email || "");
        form.setValue("fullName", user.user_metadata?.full_name || "");
        form.setValue("phone", user.user_metadata?.phone || "");
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
        />
        <Button 
          onClick={searchUser}
          disabled={isSearching || !searchEmail}
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