import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Calendar, Clock, Target } from "lucide-react";
import { calculateAnalyticsStats } from "../../utils/analyticsCalculations";

interface AnalyticsStatsProps {
  bookings: any[];
  stepsTracking: any[];
}

export const AnalyticsStats = ({ bookings, stepsTracking }: AnalyticsStatsProps) => {
  const stats = calculateAnalyticsStats(bookings, stepsTracking);

  const metrics = [
    {
      title: "Réservations totales",
      value: stats.currentPeriod.totalBookings,
      change: stats.variations.totalBookings ? `${Math.round(stats.variations.totalBookings)}%` : '0%',
      icon: Calendar,
      trend: stats.variations.totalBookings >= 0 ? "up" : "down"
    },
    {
      title: "Réservations complétées",
      value: stats.currentPeriod.completedBookings,
      change: stats.variations.completedBookings ? `${Math.round(stats.variations.completedBookings)}%` : '0%',
      icon: Users,
      trend: stats.variations.completedBookings >= 0 ? "up" : "down"
    },
    {
      title: "Taux de conversion",
      value: `${stats.currentPeriod.conversionRate}%`,
      change: stats.variations.conversionRate ? `${Math.round(stats.variations.conversionRate)}%` : '0%',
      icon: Target,
      trend: stats.variations.conversionRate >= 0 ? "up" : "down"
    },
    {
      title: "Durée moyenne",
      value: `${stats.currentPeriod.averageDuration}min`,
      change: stats.variations.averageDuration ? `${Math.round(stats.variations.averageDuration)}%` : '0%',
      icon: Clock,
      trend: stats.variations.averageDuration >= 0 ? "up" : "down"
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