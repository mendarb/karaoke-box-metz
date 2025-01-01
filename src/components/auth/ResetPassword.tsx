import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { ErrorAlert } from "./reset-password/ErrorAlert";
import { PasswordResetForm } from "./reset-password/PasswordResetForm";

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePasswordReset = async () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const type = hashParams.get("type");
      const accessToken = hashParams.get("access_token");

      if (type === "recovery" && !accessToken) {
        setError("Token de réinitialisation manquant");
        return;
      }

      if (type === "recovery") {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          setError("Session invalide. Veuillez réessayer.");
          return;
        }
      }
    };

    handlePasswordReset();
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre mot de passe a été mis à jour",
      });
      
      navigate("/");
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le mot de passe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <PasswordResetForm
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};