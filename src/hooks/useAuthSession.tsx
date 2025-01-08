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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setSession(null);
          setIsAuthOpen(true);
          return;
        }

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT' || !session) {
        setSession(null);
        setIsAuthOpen(true);
      } else if (event === 'SIGNED_IN' && session) {
        setSession(session);
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