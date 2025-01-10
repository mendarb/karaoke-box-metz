import { SupabaseClient } from "@supabase/supabase-js";

export const fetchUserSignups = async (
  supabase: SupabaseClient,
  startDate: string,
  endDate: string
) => {
  console.log('Fetching user signups for period:', { startDate, endDate });

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) {
    console.error('Error fetching user signups:', error);
    return 0;
  }

  const signupsCount = data?.length || 0;
  console.log('User signups count:', signupsCount);
  return signupsCount;
};