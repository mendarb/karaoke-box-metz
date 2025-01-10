import { SupabaseClient } from "@supabase/supabase-js";
import { getGA4Data } from "@/lib/analytics/ga4";

export const fetchAnalyticsData = async (
  supabase: SupabaseClient,
  dateRange: { startDate: string; endDate: string },
  previousStartDate: string
) => {
  console.log('Fetching analytics data for:', {
    currentPeriod: { start: dateRange.startDate, end: dateRange.endDate },
    previousPeriod: { start: previousStartDate, end: dateRange.startDate }
  });

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
      .select('count')
      .gte('created_at', dateRange.startDate)
      .lte('created_at', dateRange.endDate)
      .single(),
    supabase
      .from('profiles')
      .select('count')
      .gte('created_at', previousStartDate)
      .lt('created_at', dateRange.startDate)
      .single()
  ]);

  console.log('Analytics data fetched:', {
    currentSignups,
    previousSignups,
    currentBookings: currentBookings?.length,
    previousBookings: previousBookings?.length
  });

  return {
    ga4Stats,
    currentEvents,
    previousEvents,
    currentBookings,
    previousBookings,
    currentSignups: currentSignups?.count || 0,
    previousSignups: previousSignups?.count || 0
  };
};