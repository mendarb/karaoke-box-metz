import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export const useUserState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      setSessionChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
      setSessionChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = session?.user?.email === "mendar.bouchali@gmail.com";
  const user = session?.user || null;

  return {
    session,
    user,
    isAdmin,
    isLoading,
    sessionChecked,
  };
};