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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          await handleInvalidSession();
          return;
        }

        if (!session) {
          if (mounted) {
            resetState();
          }
          return;
        }

        // Validate the session by attempting to get the user
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User fetch error:", userError);
          if (userError.message.includes('session_not_found') || userError.status === 403) {
            await handleInvalidSession();
            return;
          }
        }

        if (mounted && currentUser) {
          console.log("Valid session found for user:", currentUser.email);
          updateUserState(currentUser);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          resetState();
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

    const handleInvalidSession = async () => {
      console.log("Handling invalid session");
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Error during sign out:", error);
      }
      
      if (mounted) {
        resetState();
        toast({
          title: "Session expirée",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
          variant: "destructive",
        });
      }
    };

    const resetState = () => {
      setUser(null);
      setIsAdmin(false);
      setSessionChecked(true);
      setIsLoading(false);
    };

    const updateUserState = (currentUser: User) => {
      setUser(currentUser);
      setIsAdmin(currentUser.email === "mendar.bouchali@gmail.com");
      setSessionChecked(true);
      setIsLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (mounted) {
          if (event === 'SIGNED_OUT' || !session) {
            resetState();
          } else if (session?.user) {
            updateUserState(session.user);
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