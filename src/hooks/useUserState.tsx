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

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            await handleSessionError();
          }
          return;
        }

        if (!session) {
          if (mounted) {
            await resetState();
          }
          return;
        }

        // Vérifier si la session est valide avant de récupérer l'utilisateur
        if (!session.access_token || !session.refresh_token) {
          console.log("Session tokens missing, resetting state");
          if (mounted) {
            await handleSessionError();
          }
          return;
        }

        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User validation error:", userError);
          if (mounted) {
            await handleSessionError();
          }
          return;
        }

        if (mounted && currentUser) {
          const adminEmail = 'mendar.bouchali@gmail.com';
          const isUserAdmin = currentUser.email === adminEmail;
          console.log("Current user:", {
            email: currentUser.email,
            isAdmin: isUserAdmin,
            sessionId: session.access_token
          });
          
          setUser(currentUser);
          setIsAdmin(isUserAdmin);
          setSessionChecked(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          await handleSessionError();
        }
      }
    };

    const handleSessionError = async () => {
      try {
        // Nettoyer d'abord le state
        await resetState();
        
        // Ensuite tenter de se déconnecter proprement
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.error("Error during sign out:", signOutError);
        }

        // Nettoyer le stockage local
        localStorage.clear();
        sessionStorage.clear();
        
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
      } catch (error) {
        console.error("Error handling session error:", error);
        await resetState();
      }
    };

    const resetState = async () => {
      setUser(null);
      setIsAdmin(false);
      setSessionChecked(true);
      setIsLoading(false);
    };

    // Vérifier la session initiale
    checkSession();

    // Mettre en place l'écouteur d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (mounted) {
          if (event === 'SIGNED_OUT' || !session) {
            await resetState();
          } else if (session?.user) {
            const adminEmail = 'mendar.bouchali@gmail.com';
            const isUserAdmin = session.user.email === adminEmail;
            console.log("Auth change - User state:", {
              email: session.user.email,
              isAdmin: isUserAdmin,
              event: event
            });
            
            setUser(session.user);
            setIsAdmin(isUserAdmin);
            setSessionChecked(true);
            setIsLoading(false);
          }
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