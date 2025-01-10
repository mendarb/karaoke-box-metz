import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PeriodSelection } from "../../types/analytics";
import { format, subDays } from "date-fns";
import { getDateRange } from "./utils/dateRangeUtils";
import { calculatePercentageChange, calculateConversionRate } from "./utils/analyticsCalculations";
import { fetchAnalyticsData } from "./services/analyticsService";

export const useAnalyticsData = (period: PeriodSelection) => {
  const dateRange = getDateRange(period);
  const previousStartDate = format(subDays(new Date(dateRange.startDate), 30), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['analytics-general', period, dateRange],
    queryFn: async () => {
      const {
        ga4Stats,
        currentEvents,
        previousEvents,
        currentBookings,
        previousBookings
      } = await fetchAnalyticsData(supabase, dateRange, previousStartDate);

      // Compter les inscriptions en filtrant les événements de type SIGNUP
      const currentSignups = currentEvents?.filter(e => e.event_type === 'SIGNUP').length || 0;
      const previousSignups = previousEvents?.filter(e => e.event_type === 'SIGNUP').length || 0;
      
      // Compter les démarrages de réservation
      const currentBookingStarts = currentEvents?.filter(e => e.event_type === 'BOOKING_STARTED').length || 0;
      const previousBookingStarts = previousEvents?.filter(e => e.event_type === 'BOOKING_STARTED').length || 0;
      
      // Compter les réservations complétées (payées)
      const currentCompleted = currentBookings?.filter(b => b.payment_status === 'paid').length || 0;
      const previousCompleted = previousBookings?.filter(b => b.payment_status === 'paid').length || 0;

      // Calculer le taux de conversion
      const currentConversionRate = calculateConversionRate(currentCompleted, currentBookingStarts);
      const previousConversionRate = calculateConversionRate(previousCompleted, previousBookingStarts);

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