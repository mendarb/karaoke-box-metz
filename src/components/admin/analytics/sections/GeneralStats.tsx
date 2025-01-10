import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, TrendingUp, TrendingDown, Users, Calendar, Clock, Target } from "lucide-react";
import { PeriodSelection } from "../types/analytics";

interface GeneralStatsProps {
  period: PeriodSelection;
}

const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const GeneralStats = ({ period }: GeneralStatsProps) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics-general'],
    queryFn: async () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Réservations des 30 derniers jours
      const { data: currentBookings, error: currentError } = await supabase
        .from('bookings')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .lt('created_at', now.toISOString())
        .is('deleted_at', null);

      // Réservations des 30 jours précédents
      const { data: previousBookings, error: previousError } = await supabase
        .from('bookings')
        .select('*')
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString())
        .is('deleted_at', null);

      if (currentError || previousError) throw new Error('Erreur lors de la récupération des données');

      // Calculs pour la période actuelle
      const currentTotal = currentBookings?.length || 0;
      const currentCompleted = currentBookings?.filter(b => b.payment_status === 'paid').length || 0;
      const currentAverageDuration = currentBookings?.filter(b => b.payment_status === 'paid')
        .reduce((acc, b) => acc + Number(b.duration), 0) / (currentCompleted || 1);

      // Calculs pour la période précédente
      const previousTotal = previousBookings?.length || 0;
      const previousCompleted = previousBookings?.filter(b => b.payment_status === 'paid').length || 0;
      const previousAverageDuration = previousBookings?.filter(b => b.payment_status === 'paid')
        .reduce((acc, b) => acc + Number(b.duration), 0) / (previousCompleted || 1);

      // Calcul du taux de conversion
      const { data: sessions } = await supabase
        .from('booking_steps_tracking')
        .select('session_id')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .eq('step', 1)
        .is('completed', true);

      const { data: previousSessions } = await supabase
        .from('booking_steps_tracking')
        .select('session_id')
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString())
        .eq('step', 1)
        .is('completed', true);

      const uniqueSessions = new Set(sessions?.map(s => s.session_id)).size;
      const previousUniqueSessions = new Set(previousSessions?.map(s => s.session_id)).size;

      const currentConversionRate = uniqueSessions > 0 ? (currentCompleted / uniqueSessions) * 100 : 0;
      const previousConversionRate = previousUniqueSessions > 0 ? (previousCompleted / previousUniqueSessions) * 100 : 0;

      console.log('Statistiques de conversion:', {
        période: '30 derniers jours',
        sessions_uniques: uniqueSessions,
        réservations_complétées: currentCompleted,
        taux_conversion: currentConversionRate,
        évolution: calculatePercentageChange(currentConversionRate, previousConversionRate)
      });

      return {
        currentPeriod: {
          totalBookings: currentTotal,
          completedBookings: currentCompleted,
          averageDuration: Math.round(currentAverageDuration),
          conversionRate: Math.round(currentConversionRate)
        },
        variations: {
          totalBookings: calculatePercentageChange(currentTotal, previousTotal),
          completedBookings: calculatePercentageChange(currentCompleted, previousCompleted),
          conversionRate: calculatePercentageChange(currentConversionRate, previousConversionRate),
          averageDuration: calculatePercentageChange(currentAverageDuration, previousAverageDuration)
        }
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const metrics = [
    {
      title: "Réservations totales",
      value: stats?.currentPeriod.totalBookings || 0,
      change: stats?.variations.totalBookings ? `${Math.round(stats.variations.totalBookings)}%` : '0%',
      icon: Calendar,
      trend: stats?.variations.totalBookings >= 0 ? "up" : "down"
    },
    {
      title: "Réservations complétées",
      value: stats?.currentPeriod.completedBookings || 0,
      change: stats?.variations.completedBookings ? `${Math.round(stats.variations.completedBookings)}%` : '0%',
      icon: Users,
      trend: stats?.variations.completedBookings >= 0 ? "up" : "down"
    },
    {
      title: "Taux de conversion",
      value: `${stats?.currentPeriod.conversionRate || 0}%`,
      change: stats?.variations.conversionRate ? `${Math.round(stats.variations.conversionRate)}%` : '0%',
      icon: Target,
      trend: stats?.variations.conversionRate >= 0 ? "up" : "down"
    },
    {
      title: "Durée moyenne",
      value: `${stats?.currentPeriod.averageDuration || 0}min`,
      change: stats?.variations.averageDuration ? `${Math.round(stats.variations.averageDuration)}%` : '0%',
      icon: Clock,
      trend: stats?.variations.averageDuration >= 0 ? "up" : "down"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </p>
              <p className="text-2xl font-bold">
                {metric.value}
              </p>
              <div className="flex items-center text-sm">
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-1">vs 30j précédents</span>
              </div>
            </div>
            <metric.icon className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>
      ))}
    </div>
  );
};
