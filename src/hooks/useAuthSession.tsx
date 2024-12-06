import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useAuthSession = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, opening auth modal");
          setIsAuthOpen(true);
        } else {
          console.log("Session found, user is authenticated");
          setIsAuthOpen(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthOpen(true);
      } finally {
        setIsLoading(false);
        setSessionChecked(true);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (!session) {
        setIsAuthOpen(true);
      } else {
        setIsAuthOpen(false);
      }
      setIsLoading(false);
      setSessionChecked(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return { isAuthOpen, setIsAuthOpen, isLoading, sessionChecked };
};