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

    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial session:", session);
      setSession(session);
      if (session?.user?.id) {
        await loadUserProfile(session.user.id);
      }
      setIsLoading(false);
      setSessionChecked(true);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
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

  const isAdmin = session?.user?.email === "mendar.bouchali@gmail.com";
  const user = session?.user || null;

  console.log("Current session state:", {
    isAdmin,
    userEmail: session?.user?.email,
    sessionExists: !!session,
    userExists: !!user
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