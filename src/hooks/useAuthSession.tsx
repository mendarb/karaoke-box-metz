import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useAuthSession = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session check error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("No session found, keeping auth modal open");
          if (mounted) {
            setIsAuthOpen(true);
            setSessionChecked(true);
          }
          return;
        }

        const { error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("User verification failed:", userError);
          if (userError.message.includes("session_not_found")) {
            console.log("Session invalid, signing out...");
            await supabase.auth.signOut();
            throw new Error("Session expired");
          }
          throw userError;
        }

        console.log("Session valid, closing auth modal");
        if (mounted) {
          setIsAuthOpen(false);
          setSessionChecked(true);
        }
      } catch (error: any) {
        console.error("Session verification failed:", error);
        if (mounted) {
          await supabase.auth.signOut();
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
            variant: "destructive",
          });
          setIsAuthOpen(true);
          setSessionChecked(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (mounted) {
        if (!session) {
          console.log("Auth state changed: no session");
          setIsAuthOpen(true);
        } else {
          try {
            const { error: userError } = await supabase.auth.getUser();
            if (userError) {
              console.error("New session verification failed:", userError);
              throw userError;
            }
            console.log("Auth state changed: valid session found");
            setIsAuthOpen(false);
          } catch (error) {
            console.error("New session verification failed:", error);
            await supabase.auth.signOut();
            setIsAuthOpen(true);
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return { isAuthOpen, setIsAuthOpen, isLoading, sessionChecked };
};