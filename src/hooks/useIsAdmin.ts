import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useIsAdmin = (userId?: string) => {
  return useQuery({
    queryKey: ['is-admin', userId],
    queryFn: async () => {
      if (!userId) return false;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data?.role === 'admin';
    },
    enabled: !!userId
  });
};