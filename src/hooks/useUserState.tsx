import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

interface UserState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  sessionChecked: boolean;
}

export const useUserState = (): UserState => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const loadUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error loading user profile:', error);
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error('Error in loadUserProfile:', error);
      }
    };

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session);
        setSession(session);
        
        if (session?.user?.id) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
        setSessionChecked(true);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
      
      if (session?.user?.id) {
        await loadUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
      setSessionChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Explicitly check for admin email
  const isAdmin = session?.user?.email === "mendar.bouchali@gmail.com";
  const user = session?.user || null;

  // Log admin status for debugging
  console.log("Admin check:", {
    email: session?.user?.email,
    isAdmin,
    sessionChecked,
    isLoading
  });

  return {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    sessionChecked,
  };
};