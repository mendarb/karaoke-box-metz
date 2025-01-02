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

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session in useUserState:", session);
      setSession(session);
      if (session?.user?.id) {
        loadUserProfile(session.user.id);
      }
      setIsLoading(false);
      setSessionChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
      if (session?.user?.id) {
        loadUserProfile(session.user.id);
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

  console.log("isAdmin:", isAdmin, "user email:", session?.user?.email);

  return {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    sessionChecked,
  };
};