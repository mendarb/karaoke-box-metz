import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PeriodSelection } from "../../types/analytics";
import { getGA4Data } from "@/lib/analytics/ga4";
import { format, subDays } from "date-fns";

export const useAnalyticsData = (period: PeriodSelection) => {
  const getDateRange = () => {
    const now = new Date();
    switch (period.type) {
      case "24h":
        return {
          startDate: format(subDays(now, 1), 'yyyy-MM-dd'),
          endDate: format(now, 'yyyy-MM-dd')
        };
      case "7d":
        return {
          startDate: format(subDays(now, 7), 'yyyy-MM-dd'),
          endDate: format(now, 'yyyy-MM-dd')
        };
      case "30d":
        return {
          startDate: format(subDays(now, 30), 'yyyy-MM-dd'),
          endDate: format(now, 'yyyy-MM-dd')
        };
      case "90d":
        return {
          startDate: format(subDays(now, 90), 'yyyy-MM-dd'),
          endDate: format(now, 'yyyy-MM-dd')
        };
      case "custom":
        if (period.dateRange?.from && period.dateRange?.to) {
          return {
            startDate: format(period.dateRange.from, 'yyyy-MM-dd'),
            endDate: format(period.dateRange.to, 'yyyy-MM-dd')
          };
        }
      default:
        return {
          startDate: format(subDays(now, 30), 'yyyy-MM-dd'),
          endDate: format(now, 'yyyy-MM-dd')
        };
    }
  };

  const dateRange = getDateRange();
  const previousStartDate = format(subDays(new Date(dateRange.startDate), 30), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['analytics-general', period, dateRange],
    queryFn: async () => {
      const [
        ga4Stats,
        { data: currentEvents },
        { data: previousEvents },
        { data: currentBookings },
        { data: previousBookings }
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
          .is('deleted_at', null)
      ]);

      const currentSignups = currentEvents?.filter(e => e.event_type === 'SIGNUP').length || 0;
      const previousSignups = previousEvents?.filter(e => e.event_type === 'SIGNUP').length || 0;
      
      const currentBookingStarts = currentEvents?.filter(e => e.event_type === 'BOOKING_STARTED').length || 0;
      const previousBookingStarts = previousEvents?.filter(e => e.event_type === 'BOOKING_STARTED').length || 0;
      
      const currentCompleted = currentBookings?.filter(b => b.payment_status === 'paid').length || 0;
      const previousCompleted = previousBookings?.filter(b => b.payment_status === 'paid').length || 0;

      const currentConversionRate = currentBookingStarts > 0 ? (currentCompleted / currentBookingStarts) * 100 : 0;
      const previousConversionRate = previousBookingStarts > 0 ? (previousCompleted / previousBookingStarts) * 100 : 0;

      const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
      };

      return {
        ga4: ga4Stats || {
          summary: {
            activeUsers: 0,
            pageViews: 0,
            sessions: 0,
            averageSessionDuration: 0,
            bounceRate: 0,
            engagementRate: 0,
            totalUsers: 0
          }
        },
        currentPeriod: {
          signups: currentSignups,
          bookingStarts: currentBookingStarts,
          completedBookings: currentCompleted,
          conversionRate: Math.round(currentConversionRate)
        },
        variations: {
          signups: calculatePercentageChange(currentSignups, previousSignups),
          bookingStarts: calculatePercentageChange(currentBookingStarts, previousBookingStarts),
          completedBookings: calculatePercentageChange(currentCompleted, previousCompleted),
          conversionRate: calculatePercentageChange(currentConversionRate, previousConversionRate)
        }
      };
    }
  });
};