import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const EmailSection = () => {
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    setIsLoading(true);
    console.log("Début de la mise à jour de l'email vers:", newEmail);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Utilisateur actuel:", user);

      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const { data, error } = await supabase.auth.updateUser({ 
        email: newEmail 
      }, {
        emailRedirectTo: `${window.location.origin}/account`
      });

      console.log("Réponse de updateUser:", { data, error });

      if (error) {
        throw error;
      }

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour confirmer le changement d'email",
      });
      
      setShowEmailInput(false);
      setNewEmail("");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'email:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de modifier l'email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Modifier votre email</h3>
      {showEmailInput ? (
        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <div>
            <Label htmlFor="new-email">Nouvel email</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nouveau@email.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Confirmer"}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setShowEmailInput(false);
                setNewEmail("");
              }}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </div>
        </form>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setShowEmailInput(true)}
        >
          Changer d'email
        </Button>
      )}
    </div>
  );
};