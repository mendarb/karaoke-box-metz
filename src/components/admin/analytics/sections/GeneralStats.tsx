import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, TrendingUp, TrendingDown, Users, Calendar, Clock, Target, Eye, Activity, Globe, Smartphone, Gauge, UserPlus } from "lucide-react";
import { PeriodSelection } from "../types/analytics";
import { getGA4Data } from "@/lib/analytics/ga4";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";

interface GeneralStatsProps {
  period: PeriodSelection;
}

const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const getDateRange = (period: PeriodSelection) => {
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
        startDate: '30daysAgo',
        endDate: 'today'
      };
  }
};

export const GeneralStats = ({ period }: GeneralStatsProps) => {
  const dateRange = getDateRange(period);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics-general', period, dateRange],
    queryFn: async () => {
      const [
        ga4Stats,
        { data: currentEvents },
        { data: previousEvents },
        { data: currentBookings },
        { data: previousBookings }
      ] = await Promise.all([
        // Données Google Analytics
        getGA4Data(dateRange.startDate, dateRange.endDate),
        // Événements utilisateurs actuels
        supabase
          .from('user_events')
          .select('*')
          .gte('created_at', dateRange.startDate)
          .lte('created_at', dateRange.endDate),
        // Événements utilisateurs précédents
        supabase
          .from('user_events')
          .select('*')
          .gte('created_at', format(subDays(new Date(dateRange.startDate), 30), 'yyyy-MM-dd'))
          .lt('created_at', dateRange.startDate),
        // Réservations actuelles
        supabase
          .from('bookings')
          .select('*')
          .gte('created_at', dateRange.startDate)
          .lte('created_at', dateRange.endDate)
          .is('deleted_at', null),
        // Réservations précédentes
        supabase
          .from('bookings')
          .select('*')
          .gte('created_at', format(subDays(new Date(dateRange.startDate), 30), 'yyyy-MM-dd'))
          .lt('created_at', dateRange.startDate)
          .is('deleted_at', null)
      ]);

      // Calcul des inscriptions
      const currentSignups = currentEvents?.filter(e => e.event_type === 'SIGNUP').length || 0;
      const previousSignups = previousEvents?.filter(e => e.event_type === 'SIGNUP').length || 0;
      
      // Calcul des démarrages de réservation
      const currentBookingStarts = currentEvents?.filter(e => e.event_type === 'BOOKING_STARTED').length || 0;
      const previousBookingStarts = previousEvents?.filter(e => e.event_type === 'BOOKING_STARTED').length || 0;
      
      // Calcul des réservations complétées
      const currentCompleted = currentBookings?.filter(b => b.payment_status === 'paid').length || 0;
      const previousCompleted = previousBookings?.filter(b => b.payment_status === 'paid').length || 0;

      // Calcul du taux de conversion
      const currentConversionRate = currentBookingStarts > 0 ? (currentCompleted / currentBookingStarts) * 100 : 0;
      const previousConversionRate = previousBookingStarts > 0 ? (previousCompleted / previousBookingStarts) * 100 : 0;

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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const metrics = [
    {
      title: "Visiteurs actifs",
      value: stats?.ga4.summary.activeUsers || 0,
      icon: Users,
      description: "Nombre de visiteurs actifs sur la période"
    },
    {
      title: "Pages vues",
      value: stats?.ga4.summary.pageViews || 0,
      icon: Eye,
      description: "Nombre total de pages vues"
    },
    {
      title: "Taux d'engagement",
      value: `${Math.round(stats?.ga4.summary.engagementRate || 0)}%`,
      icon: Gauge,
      description: "Pourcentage de sessions engagées"
    },
    {
      title: "Taux de rebond",
      value: `${Math.round(stats?.ga4.summary.bounceRate || 0)}%`,
      icon: Activity,
      description: "Pourcentage de visites avec une seule page vue"
    },
    {
      title: "Utilisateurs inscrits",
      value: stats?.currentPeriod.signups || 0,
      change: stats?.variations.signups ? `${Math.round(stats.variations.signups)}%` : '0%',
      icon: UserPlus,
      trend: stats?.variations.signups >= 0 ? "up" : "down",
      description: "Nombre d'utilisateurs inscrits"
    },
    {
      title: "Taux de conversion",
      value: `${stats?.currentPeriod.conversionRate || 0}%`,
      change: stats?.variations.conversionRate ? `${Math.round(stats.variations.conversionRate)}%` : '0%',
      icon: Target,
      trend: stats?.variations.conversionRate >= 0 ? "up" : "down",
      description: "Réservations payées / Réservations initiées"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4 relative group hover:shadow-lg transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </h3>
              <metric.icon className="h-4 w-4 text-muted-foreground opacity-50" />
            </div>
            <p className="text-2xl font-bold">
              {metric.value}
            </p>
            {metric.change && (
              <div className="flex items-center text-sm">
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-1">vs période précédente</span>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-black/75 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-center">
            <p className="text-sm">{metric.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};