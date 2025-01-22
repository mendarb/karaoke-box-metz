import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { ErrorAlert } from "./reset-password/ErrorAlert";
import { PasswordResetForm } from "./reset-password/PasswordResetForm";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const setupSession = async () => {
      try {
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const type = searchParams.get("type");

        console.log("Reset password params:", { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken, 
          type 
        });

        if (!accessToken || type !== "recovery") {
          console.error("Invalid recovery link parameters");
          setError("Le lien de réinitialisation est invalide. Veuillez demander un nouveau lien.");
          return;
        }

        // Clear any existing session
        await supabase.auth.signOut();

        // Wait a bit before setting up the new session
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        console.log("Session setup result:", { 
          success: !!session, 
          error: sessionError?.message 
        });

        if (sessionError || !session) {
          console.error("Session setup failed:", sessionError);
          setError("Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.");
          return;
        }

      } catch (err) {
        console.error("Error in setupSession:", err);
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    };

    setupSession();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Verify session is still valid
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Session expirée. Veuillez demander un nouveau lien.");
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }

      // Show success message
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès",
      });

      // Wait for session update
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sign out and redirect
      await supabase.auth.signOut();
      
      // Wait for toast to be visible
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err: any) {
      console.error("Password update error:", err);
      setError(err.message || "Une erreur est survenue lors de la mise à jour du mot de passe");
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