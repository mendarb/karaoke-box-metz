import { Users, TrendingUp, TrendingDown, UserPlus, Calendar, Euro } from "lucide-react";
import { calculatePercentageChange } from "./utils/analyticsCalculations";

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