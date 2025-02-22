import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Calendar, Clock, Target, UserCheck, UserCog } from "lucide-react";
import { calculateAnalyticsStats } from "../../utils/analyticsCalculations";
import { PeriodSelection } from "../../types/analytics";

interface AnalyticsStatsProps {
  bookings: any[];
  previousBookings: any[];
  events: any[];
  previousEvents: any[];
  period: PeriodSelection;
}

export const AnalyticsStats = ({ bookings, previousBookings, events, previousEvents, period }: AnalyticsStatsProps) => {
  const stats = calculateAnalyticsStats(bookings, previousBookings, events, previousEvents);

  const metrics = [
    {
      title: "Utilisateurs inscrits",
      value: stats.currentPeriod.registeredUsers,
      change: stats.variations.registeredUsers ? `${Math.round(stats.variations.registeredUsers)}%` : '0%',
      icon: Users,
      trend: stats.variations.registeredUsers >= 0 ? "up" : "down"
    },
    {
      title: "Réservations débutées",
      value: stats.currentPeriod.formStartCount || 0,
      change: stats.variations.formStartCount ? `${Math.round(stats.variations.formStartCount)}%` : '0%',
      icon: Calendar,
      trend: stats.variations.formStartCount >= 0 ? "up" : "down"
    },
    {
      title: "Réservations payées",
      value: stats.currentPeriod.paidBookings,
      change: stats.variations.paidBookings ? `${Math.round(stats.variations.paidBookings)}%` : '0%',
      icon: Target,
      trend: stats.variations.paidBookings >= 0 ? "up" : "down"
    },
    {
      title: "Réservations admin",
      value: stats.currentPeriod.adminBookings,
      change: stats.variations.adminBookings ? `${Math.round(stats.variations.adminBookings)}%` : '0%',
      icon: UserCog,
      trend: stats.variations.adminBookings >= 0 ? "up" : "down"
    },
    {
      title: "Comptes confirmés",
      value: stats.currentPeriod.confirmedAccounts,
      change: stats.variations.confirmedAccounts ? `${Math.round(stats.variations.confirmedAccounts)}%` : '0%',
      icon: UserCheck,
      trend: stats.variations.confirmedAccounts >= 0 ? "up" : "down"
    },
    {
      title: "Taux de conversion",
      value: `${stats.currentPeriod.conversionRate}%`,
      change: stats.variations.conversionRate ? `${Math.round(stats.variations.conversionRate)}%` : '0%',
      icon: Target,
      trend: stats.variations.conversionRate >= 0 ? "up" : "down"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <span className="text-muted-foreground ml-1">vs période précédente</span>
              </div>
            </div>
            <metric.icon className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>
      ))}
    </div>
  );
};