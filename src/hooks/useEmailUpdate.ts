import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const useEmailUpdate = () => {
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

  const resetForm = () => {
    setShowEmailInput(false);
    setNewEmail("");
  };

  return {
    newEmail,
    setNewEmail,
    showEmailInput,
    setShowEmailInput,
    isLoading,
    handleUpdateEmail,
    resetForm,
  };
};