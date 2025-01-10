import { SupabaseClient } from "@supabase/supabase-js";

export const fetchUserSignups = async (
  supabase: SupabaseClient,
  startDate: string,
  endDate: string
) => {
  console.log('Fetching user signups for period:', { startDate, endDate });

  const { count } = await supabase
    .from('profiles')
    .select('count')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .single() || { count: 0 };

  console.log('User signups count:', count);
  return count || 0;
};