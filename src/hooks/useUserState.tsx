import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useUserState = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Récupérer la session actuelle
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            setUser(null);
            setIsAdmin(false);
            setIsLoading(false);
            setSessionChecked(true);
          }
          return;
        }

        // Si pas de session valide, réinitialiser l'état
        if (!session) {
          if (mounted) {
            setUser(null);
            setIsAdmin(false);
            setIsLoading(false);
            setSessionChecked(true);
          }
          return;
        }

        // Vérifier si la session est toujours valide
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User fetch error:", userError);
          // Si l'erreur indique une session invalide, déconnecter l'utilisateur
          if (userError.message.includes('session_not_found') || userError.status === 403) {
            await supabase.auth.signOut();
            if (mounted) {
              setUser(null);
              setIsAdmin(false);
              toast({
                title: "Session expirée",
                description: "Votre session a expiré. Veuillez vous reconnecter.",
                variant: "destructive",
              });
            }
          }
          if (mounted) {
            setIsLoading(false);
            setSessionChecked(true);
          }
          return;
        }

        if (mounted && currentUser) {
          console.log("Session found for user:", currentUser.email);
          setUser(currentUser);
          setIsAdmin(currentUser.email === "mendar.bouchali@gmail.com");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
          toast({
            title: "Erreur d'authentification",
            description: "Une erreur est survenue lors de l'initialisation",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            setIsAdmin(session.user.email === "mendar.bouchali@gmail.com");
          } else {
            setUser(null);
            setIsAdmin(false);
          }
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return { user, isAdmin, isLoading, sessionChecked };
};