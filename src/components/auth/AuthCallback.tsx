import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";

export function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        
        if (session) {
          console.log("Session found:", session.user.id);
          
          // Check if user has a phone number
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('phone')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Profile error:", profileError);
          }

          if (!profile?.phone) {
            console.log("No phone number found, redirecting to account");
            toast({
              title: "Complétez votre profil",
              description: "Veuillez ajouter votre numéro de téléphone pour finaliser votre inscription.",
            });
            navigate("/account", { replace: true });
          } else {
            console.log("Profile complete, redirecting to home");
            toast({
              title: "Connexion réussie",
              description: "Bienvenue sur K.Box !",
            });
            navigate("/", { replace: true });
          }
        } else {
          console.log("No session found, redirecting to home");
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast({
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
          variant: "destructive",
        });
        navigate("/", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}