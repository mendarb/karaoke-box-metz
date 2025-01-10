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
      const { ga4Stats } = await fetchAnalyticsData(supabase, dateRange, previousStartDate);

      // Récupérer les inscriptions pour la période actuelle
      const { data: currentSignups } = await supabase
        .from('user_events')
        .select('count')
        .eq('event_type', 'SIGNUP')
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
        .single();

      // Récupérer les réservations payées et confirmées pour la période actuelle
      const { data: currentConfirmedBookings } = await supabase
        .from('bookings')
        .select('id, price')
        .eq('payment_status', 'paid')
        .eq('status', 'confirmed')
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate);

      // Récupérer les données pour la période précédente
      const { data: previousSignups } = await supabase
        .from('user_events')
        .select('count')
        .eq('event_type', 'SIGNUP')
        .gte('created_at', previousStartDate)
        .lt('created_at', dateRange.startDate)
        .single();

      const { data: previousConfirmedBookings } = await supabase
        .from('bookings')
        .select('id, price')
        .eq('payment_status', 'paid')
        .eq('status', 'confirmed')
        .gte('created_at', previousStartDate)
        .lt('created_at', dateRange.startDate);

      // Calculer les métriques
      const currentSignupsCount = currentSignups?.count || 0;
      const currentBookingsCount = currentConfirmedBookings?.length || 0;
      const previousSignupsCount = previousSignups?.count || 0;
      const previousBookingsCount = previousConfirmedBookings?.length || 0;

      // Calculer les revenus
      const currentRevenue = currentConfirmedBookings?.reduce((sum, booking) => sum + Number(booking.price), 0) || 0;
      const previousRevenue = previousConfirmedBookings?.reduce((sum, booking) => sum + Number(booking.price), 0) || 0;

      // Calculer le taux de conversion (réservations confirmées / inscriptions)
      const currentConversionRate = currentSignupsCount > 0 
        ? (currentBookingsCount / currentSignupsCount) * 100 
        : 0;
      const previousConversionRate = previousSignupsCount > 0 
        ? (previousBookingsCount / previousSignupsCount) * 100 
        : 0;

      console.log('Analytics metrics:', {
        signups: { current: currentSignupsCount, previous: previousSignupsCount },
        confirmedBookings: { current: currentBookingsCount, previous: previousBookingsCount },
        revenue: { current: currentRevenue, previous: previousRevenue },
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
          confirmedBookings: currentBookingsCount,
          conversionRate: Number(currentConversionRate.toFixed(1)),
          revenue: currentRevenue
        },
        variations: {
          signups: calculatePercentageChange(currentSignupsCount, previousSignupsCount),
          confirmedBookings: calculatePercentageChange(currentBookingsCount, previousBookingsCount),
          conversionRate: calculatePercentageChange(currentConversionRate, previousConversionRate),
          revenue: calculatePercentageChange(currentRevenue, previousRevenue)
        }
      };
    }
  });
};