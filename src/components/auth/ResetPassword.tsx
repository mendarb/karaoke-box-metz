import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorAlert } from "./reset-password/ErrorAlert";
import { PasswordResetForm } from "./reset-password/PasswordResetForm";

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleHashFragment = async () => {
      try {
        setIsValidatingToken(true);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");
        
        if (!accessToken || type !== "recovery") {
          console.error("Invalid or missing access token");
          setError("Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.");
          return;
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: "",
        });

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError("Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.");
        }
      } catch (err) {
        console.error("Hash handling error:", err);
        setError("Une erreur est survenue lors de la validation du lien. Veuillez réessayer.");
      } finally {
        setIsValidatingToken(false);
      }
    };

    handleHashFragment();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès",
      });

      navigate("/");
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setError(err.message || "Une erreur est survenue lors de la réinitialisation du mot de passe");
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la réinitialisation du mot de passe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isValidatingToken) {
    return (
      <div className="container max-w-md mx-auto p-4 flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return <PasswordResetForm 
    newPassword={newPassword}
    setNewPassword={setNewPassword}
    onSubmit={handleSubmit}
    isLoading={loading}
  />;
};