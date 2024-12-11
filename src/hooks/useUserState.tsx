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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (mounted) {
            setUser(null);
            setIsAdmin(false);
            setSessionChecked(true);
          }
          return;
        }

        if (mounted) {
          setUser(session.user);
          setIsAdmin(session.user.email === "mendar.bouchali@gmail.com");
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
          if (event === 'SIGNED_OUT' || !session) {
            setUser(null);
            setIsAdmin(false);
          } else if (session?.user) {
            setUser(session.user);
            setIsAdmin(session.user.email === "mendar.bouchali@gmail.com");
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