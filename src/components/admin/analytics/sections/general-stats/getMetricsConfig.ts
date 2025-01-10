import { Users, TrendingUp, TrendingDown, UserPlus, Calendar, Euro, Eye, Clock, BarChart } from "lucide-react";

type MetricConfig = {
  title: string;
  value: string | number;
  icon: any; // Using any for icon type as it's a Lucide component
  description: string;
  change?: string;
  trend?: "up" | "down";
  isPercentage?: boolean;
}

export const getMetricsConfig = (stats: any): MetricConfig[] => [
  {
    title: "Utilisateurs actifs",
    value: stats.ga4.summary.activeUsers || 0,
    icon: Users,
    description: "Nombre d'utilisateurs actifs sur la période",
  },
  {
    title: "Pages vues",
    value: stats.ga4.summary.pageViews || 0,
    icon: Eye,
    description: "Nombre total de pages vues sur la période",
  },
  {
    title: "Temps moyen",
    value: `${Math.round((stats.ga4.summary.averageEngagementTime || 0) / 60)}min`,
    icon: Clock,
    description: "Temps moyen passé sur le site",
  },
  {
    title: "Taux d'engagement",
    value: stats.ga4.summary.engagementRate || 0,
    icon: BarChart,
    description: "Pourcentage de sessions engagées",
    isPercentage: true
  },
  {
    title: "Utilisateurs inscrits",
    value: stats.currentPeriod.signups,
    icon: UserPlus,
    description: "Nombre total d'utilisateurs inscrits sur la période",
    change: `${Math.abs(stats.variations.signups).toFixed(1)}%`,
    trend: stats.variations.signups >= 0 ? "up" : "down"
  },
  {
    title: "Réservations confirmées",
    value: stats.currentPeriod.confirmedBookings,
    icon: Calendar,
    description: "Nombre de réservations confirmées et payées",
    change: `${Math.abs(stats.variations.confirmedBookings).toFixed(1)}%`,
    trend: stats.variations.confirmedBookings >= 0 ? "up" : "down"
  },
  {
    title: "Taux de conversion",
    value: stats.currentPeriod.conversionRate,
    icon: TrendingUp,
    description: "Pourcentage d'inscrits qui ont effectué une réservation",
    change: `${Math.abs(stats.variations.conversionRate).toFixed(1)}%`,
    trend: stats.variations.conversionRate >= 0 ? "up" : "down",
    isPercentage: true
  },
  {
    title: "Revenus totaux",
    value: `${stats.currentPeriod.revenue || 0}€`,
    icon: Euro,
    description: "Revenus générés sur la période",
    change: stats.variations.revenue ? `${Math.abs(stats.variations.revenue).toFixed(1)}%` : "N/A",
    trend: stats.variations.revenue >= 0 ? "up" : "down"
  }
];