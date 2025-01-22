import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserState } from "./useUserState";

export const useIsAdmin = () => {
  const { user, isLoading: isUserLoading } = useUserState();

  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          return false;
        }

        return data?.role === 'admin';
      } catch (error) {
        console.error('Error in admin check:', error);
        return false;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};