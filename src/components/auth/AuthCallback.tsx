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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          // Check if user has a phone number
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('phone')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Erreur lors de la récupération du profil:", profileError);
          }

          // Stocker la session dans le localStorage pour éviter la boucle
          localStorage.setItem('auth_callback_processed', 'true');

          if (!profile?.phone) {
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
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Erreur lors de la redirection:", error);
        toast({
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
          variant: "destructive",
        });
        navigate("/", { replace: true });
      }
    };

    // Vérifier si le callback a déjà été traité
    const isCallbackProcessed = localStorage.getItem('auth_callback_processed');
    
    if (!isCallbackProcessed) {
      handleAuthCallback();
    } else {
      // Nettoyer le flag et rediriger
      localStorage.removeItem('auth_callback_processed');
      navigate("/", { replace: true });
    }
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}