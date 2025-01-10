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
        // Récupérer la session depuis l'URL
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erreur de session:", error);
          throw error;
        }
        
        if (session) {
          // Vérifier si l'utilisateur a un numéro de téléphone
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('phone')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Erreur de profil:", profileError);
          }

          if (!profile?.phone) {
            // Rediriger vers la page de profil si pas de numéro
            toast({
              title: "Complétez votre profil",
              description: "Veuillez ajouter votre numéro de téléphone pour finaliser votre inscription.",
            });
            navigate("/account", { replace: true });
          } else {
            toast({
              title: "Connexion réussie",
              description: "Bienvenue sur K.Box !",
            });
            navigate("/", { replace: true });
          }
        } else {
          // Si pas de session, rediriger vers la page d'accueil
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        toast({
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
          variant: "destructive",
        });
        navigate("/", { replace: true });
      }
    };

    // Exécuter immédiatement
    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}