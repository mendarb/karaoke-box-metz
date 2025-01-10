import { Users, Eye, Gauge, Activity, UserPlus, Target } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Metric {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  change?: string;
  trend?: "up" | "down";
}

interface AnalyticsData {
  ga4: {
    summary: {
      activeUsers: number;
      pageViews: number;
      engagementRate: number;
      bounceRate: number;
    };
  };
  currentPeriod: {
    signups: number;
    conversionRate: number;
  };
  variations: {
    signups: number;
    conversionRate: number;
  };
}

export const getMetricsConfig = (stats: AnalyticsData): Metric[] => [
  {
    title: "Visiteurs actifs",
    value: stats.ga4.summary.activeUsers || 0,
    icon: Users,
    description: "Nombre de visiteurs actifs sur la période"
  },
  {
    title: "Pages vues",
    value: stats.ga4.summary.pageViews || 0,
    icon: Eye,
    description: "Nombre total de pages vues"
  },
  {
    title: "Taux d'engagement",
    value: `${Math.round(stats.ga4.summary.engagementRate || 0)}%`,
    icon: Gauge,
    description: "Pourcentage de sessions engagées"
  },
  {
    title: "Taux de rebond",
    value: `${Math.round(stats.ga4.summary.bounceRate || 0)}%`,
    icon: Activity,
    description: "Pourcentage de visites avec une seule page vue"
  },
  {
    title: "Utilisateurs inscrits",
    value: stats.currentPeriod.signups || 0,
    change: `${Math.round(stats.variations.signups)}%`,
    icon: UserPlus,
    trend: stats.variations.signups >= 0 ? "up" : "down",
    description: "Nombre d'utilisateurs inscrits"
  },
  {
    title: "Taux de conversion",
    value: `${stats.currentPeriod.conversionRate || 0}%`,
    change: `${Math.round(stats.variations.conversionRate)}%`,
    icon: Target,
    trend: stats.variations.conversionRate >= 0 ? "up" : "down",
    description: "Réservations payées / Réservations initiées"
  }
];