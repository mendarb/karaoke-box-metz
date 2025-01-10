import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PeriodSelection } from "../../types/analytics";
import { format, subDays } from "date-fns";
import { getDateRange } from "./utils/dateRangeUtils";
import { calculatePercentageChange } from "./utils/analyticsCalculations";
import { fetchAnalyticsData } from "./services/analyticsService";
import { fetchUserSignups } from "./services/userAnalyticsService";
import { fetchBookings, calculateBookingMetrics } from "./services/bookingAnalyticsService";

export const useAnalyticsData = (period: PeriodSelection) => {
  const dateRange = getDateRange(period);
  const previousStartDate = format(subDays(new Date(dateRange.startDate), 30), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['analytics-general', period, dateRange],
    queryFn: async () => {
      console.log('Fetching analytics data for period:', period);

      const [
        { ga4Stats },
        currentSignupsCount,
        previousSignupsCount,
        currentBookings,
        previousBookings
      ] = await Promise.all([
        fetchAnalyticsData(supabase, dateRange, previousStartDate),
        fetchUserSignups(supabase, dateRange.startDate, dateRange.endDate),
        fetchUserSignups(supabase, previousStartDate, dateRange.startDate),
        fetchBookings(supabase, dateRange.startDate, dateRange.endDate),
        fetchBookings(supabase, previousStartDate, dateRange.startDate)
      ]);

      const currentMetrics = calculateBookingMetrics(currentBookings);
      const previousMetrics = calculateBookingMetrics(previousBookings);

      // Calculer le taux de conversion
      const currentConversionRate = currentSignupsCount > 0 
        ? (currentMetrics.bookingsCount / currentSignupsCount) * 100 
        : 0;
      const previousConversionRate = previousSignupsCount > 0 
        ? (previousMetrics.bookingsCount / previousSignupsCount) * 100 
        : 0;

      console.log('Analytics metrics:', {
        signups: { current: currentSignupsCount, previous: previousSignupsCount },
        confirmedBookings: { 
          current: currentMetrics.bookingsCount, 
          previous: previousMetrics.bookingsCount 
        },
        revenue: { 
          current: currentMetrics.revenue, 
          previous: previousMetrics.revenue 
        },
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
          signups: currentSignupsCount,
          confirmedBookings: currentMetrics.bookingsCount,
          conversionRate: Number(currentConversionRate.toFixed(1)),
          revenue: currentMetrics.revenue
        },
        variations: {
          signups: calculatePercentageChange(currentSignupsCount, previousSignupsCount),
          confirmedBookings: calculatePercentageChange(
            currentMetrics.bookingsCount, 
            previousMetrics.bookingsCount
          ),
          conversionRate: calculatePercentageChange(
            currentConversionRate, 
            previousConversionRate
          ),
          revenue: calculatePercentageChange(
            currentMetrics.revenue, 
            previousMetrics.revenue
          )
        }
      };
    }
  });
};