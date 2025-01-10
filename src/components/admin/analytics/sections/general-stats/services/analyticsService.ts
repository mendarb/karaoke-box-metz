import { SupabaseClient } from "@supabase/supabase-js";
import { getGA4Data } from "@/lib/analytics/ga4";

export const fetchAnalyticsData = async (
  supabase: SupabaseClient,
  dateRange: { startDate: string; endDate: string },
  previousStartDate: string
) => {
  const [
    ga4Stats,
    { data: currentEvents },
    { data: previousEvents },
    { data: currentBookings },
    { data: previousBookings },
    { data: currentSignups },
    { data: previousSignups }
  ] = await Promise.all([
    getGA4Data(dateRange.startDate, dateRange.endDate),
    supabase
      .from('user_events')
      .select('*')
      .gte('created_at', dateRange.startDate)
      .lte('created_at', dateRange.endDate),
    supabase
      .from('user_events')
      .select('*')
      .gte('created_at', previousStartDate)
      .lt('created_at', dateRange.startDate),
    supabase
      .from('bookings')
      .select('*')
      .gte('created_at', dateRange.startDate)
      .lte('created_at', dateRange.endDate)
      .is('deleted_at', null),
    supabase
      .from('bookings')
      .select('*')
      .gte('created_at', previousStartDate)
      .lt('created_at', dateRange.startDate)
      .is('deleted_at', null),
    supabase
      .from('profiles')
      .select('*')
      .gte('created_at', dateRange.startDate)
      .lte('created_at', dateRange.endDate),
    supabase
      .from('profiles')
      .select('*')
      .gte('created_at', previousStartDate)
      .lt('created_at', dateRange.startDate)
  ]);

  return {
    ga4Stats,
    currentEvents,
    previousEvents,
    currentBookings,
    previousBookings,
    currentSignups,
    previousSignups
  };
};