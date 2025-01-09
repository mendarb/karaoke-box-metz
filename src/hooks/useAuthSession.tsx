import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";

export const useAuthSession = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (!session) {
          setIsAuthOpen(true);
        } else {
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
      console.log("Auth state changed:", event);
      setSession(session);
      
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthOpen(true);
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthOpen(false);
      }
      
      setIsLoading(false);
      setSessionChecked(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthOpen, setIsAuthOpen, isLoading, sessionChecked, session };
};