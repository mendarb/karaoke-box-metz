import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
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
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");
        
        console.log("Reset password params:", { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
        
        if (!accessToken || type !== "recovery") {
          console.error("Invalid token data:", { type, hasAccessToken: !!accessToken });
          setError("Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.");
          return;
        }

        // On attend que la session soit complètement établie
        await new Promise(resolve => setTimeout(resolve, 500));

        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        console.log("Session set result:", { success: !!session, error: sessionError });

        if (sessionError || !session) {
          console.error("Session error:", sessionError);
          setError("Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.");
          return;
        }

        // Vérifie que la session est bien établie
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          console.error("No session after setting it");
          setError("Erreur lors de l'authentification. Veuillez réessayer.");
          return;
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
      // Vérifie que la session est toujours valide
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Session expirée. Veuillez demander un nouveau lien.");
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error("Password update error:", error);
        throw error;
      }

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès",
      });

      // On attend que la session soit mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000));

      // On déconnecte l'utilisateur pour qu'il se reconnecte avec son nouveau mot de passe
      await supabase.auth.signOut();

      // Petit délai pour laisser le toast s'afficher
      setTimeout(() => {
        navigate("/");
      }, 1500);
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