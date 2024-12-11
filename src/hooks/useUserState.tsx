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
            handleSessionError();
          }
          return;
        }

        if (!session) {
          if (mounted) {
            resetState();
          }
          return;
        }

        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User validation error:", userError);
          if (mounted) {
            handleSessionError();
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
          handleSessionError();
        }
      }
    };

    const handleSessionError = async () => {
      try {
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        
        resetState();
        
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
      } catch (error) {
        console.error("Error handling session error:", error);
        resetState();
      }
    };

    const resetState = () => {
      setUser(null);
      setIsAdmin(false);
      setSessionChecked(true);
      setIsLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (mounted) {
          if (event === 'SIGNED_OUT' || !session) {
            resetState();
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