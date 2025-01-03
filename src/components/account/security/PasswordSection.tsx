import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useUserState } from "@/hooks/useUserState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PasswordSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUserState();

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast({
        title: "Erreur",
        description: "Email non disponible",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Ensure we have a clean base URL without any trailing colons or slashes
      const baseUrl = window.location.origin.replace(/:[/]*$/, '');
      console.log('Reset password redirect URL:', `${baseUrl}/reset-password`);

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${baseUrl}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email de réinitialisation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe</CardTitle>
        <CardDescription>
          Modifiez votre mot de passe pour sécuriser votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? "Envoi en cours..." : "Changer le mot de passe"}
        </Button>
      </CardContent>
    </Card>
  );
};