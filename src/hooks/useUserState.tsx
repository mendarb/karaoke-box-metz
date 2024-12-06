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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          if (mounted) {
            setIsLoading(false);
            setSessionChecked(true);
          }
          return;
        }

        if (mounted) {
          if (session?.user) {
            console.log("Session found for user:", session.user.email);
            setUser(session.user);
            setIsAdmin(session.user.email === "mendar.bouchali@gmail.com");
          } else {
            console.log("No session found");
            setUser(null);
            setIsAdmin(false);
          }
          setIsLoading(false);
          setSessionChecked(true);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setIsLoading(false);
          setSessionChecked(true);
          toast({
            title: "Erreur d'authentification",
            description: "Une erreur est survenue lors de l'initialisation",
            variant: "destructive",
          });
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