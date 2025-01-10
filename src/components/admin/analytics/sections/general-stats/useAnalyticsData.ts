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
        previousBookings,
        currentSignups,
        previousSignups
      } = await fetchAnalyticsData(supabase, dateRange, previousStartDate);

      // Calculer le taux de conversion basé sur les inscriptions
      const currentConversionRate = ga4Stats?.summary.activeUsers > 0 
        ? (currentSignups / ga4Stats.summary.activeUsers) * 100 
        : 0;

      const previousActiveUsers = ga4Stats?.summary.activeUsers || 1; // Éviter division par 0
      const previousConversionRate = (previousSignups / previousActiveUsers) * 100;

      console.log('Analytics metrics:', {
        signups: { current: currentSignups, previous: previousSignups },
        activeUsers: ga4Stats?.summary.activeUsers,
        conversionRates: { current: currentConversionRate, previous: previousConversionRate }
      });

      return {
        ga4: ga4Stats || {
          summary: {
            activeUsers: 0,
            pageViews: 0,
            sessions: 0,
            averageSessionDuration: 0,
            bounceRate: 0,
            engagementRate: 0,
            totalUsers: 0,
            averageEngagementTime: 0
          }
        },
        currentPeriod: {
          signups: currentSignups,
          conversionRate: Number(currentConversionRate.toFixed(2))
        },
        variations: {
          signups: calculatePercentageChange(currentSignups, previousSignups),
          conversionRate: calculatePercentageChange(currentConversionRate, previousConversionRate)
        }
      };
    }
  });
};