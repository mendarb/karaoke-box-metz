import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PeriodSelection } from "../../types/analytics";
import { format, subDays } from "date-fns";
import { getDateRange } from "./utils/dateRangeUtils";
import { calculatePercentageChange } from "./utils/analyticsCalculations";
import { fetchAnalyticsData } from "./services/analyticsService";

export const useAnalyticsData = (period: PeriodSelection) => {
  const dateRange = getDateRange(period);
  const previousStartDate = format(subDays(new Date(dateRange.startDate), 30), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['analytics-general', period, dateRange],
    queryFn: async () => {
      const {
        ga4Stats,
        currentSignups,
        previousSignups
      } = await fetchAnalyticsData(supabase, dateRange, previousStartDate);

      // Calculer le taux de conversion basé sur les inscriptions
      const activeUsers = ga4Stats?.summary.activeUsers || 1; // Éviter division par 0
      const currentConversionRate = (currentSignups / activeUsers) * 100;
      const previousConversionRate = (previousSignups / activeUsers) * 100;

      console.log('Analytics metrics:', {
        signups: { current: currentSignups, previous: previousSignups },
        activeUsers,
        conversionRates: { 
          current: currentConversionRate.toFixed(2) + '%', 
          previous: previousConversionRate.toFixed(2) + '%' 
        }
      });

      return {
        ga4: ga4Stats || {
          summary: {
            activeUsers: 0,
            pageViews: 0,
            sessions: 0,
            engagementRate: 0,
            bounceRate: 0,
            averageEngagementTime: 0,
            totalUsers: 0
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