import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserState } from "./useUserState";

export const useIsAdmin = () => {
  const { user, isLoading: isUserLoading } = useUserState();

  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data?.role === 'admin';
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache pendant 5 minutes
  });
};