import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useAuthSession = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session check error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("No session found");
          if (mounted) {
            setIsAuthOpen(true);
            setSessionChecked(true);
            setIsLoading(false);
          }
          return;
        }

        console.log("Session found, verifying user...");
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
          setIsLoading(false);
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
          setIsLoading(false);
        } else {
          try {
            console.log("Auth state changed: verifying session...");
            const { error: userError } = await supabase.auth.getUser();
            if (userError) {
              console.error("New session verification failed:", userError);
              throw userError;
            }
            console.log("Auth state changed: valid session found");
            setIsAuthOpen(false);
            setIsLoading(false);
          } catch (error) {
            console.error("New session verification failed:", error);
            await supabase.auth.signOut();
            setIsAuthOpen(true);
            setIsLoading(false);
          }
        }
        setSessionChecked(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return { isAuthOpen, setIsAuthOpen, isLoading, sessionChecked };
};