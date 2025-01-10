import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, TrendingUp, TrendingDown, Users, Calendar } from "lucide-react";

export const GeneralStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics-general'],
    queryFn: async () => {
      // Récupérer toutes les réservations
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .is('deleted_at', null);
      
      if (bookingsError) throw bookingsError;

      // Récupérer les données de tracking des étapes
      const { data: stepsTracking, error: trackingError } = await supabase
        .from('booking_steps_tracking')
        .select('*');

      if (trackingError) throw trackingError;

      // Calculer les statistiques
      const totalBookings = bookings?.length || 0;
      const completedBookings = bookings?.filter(b => b.payment_status === 'paid').length || 0;
      
      // Calculer la durée moyenne uniquement pour les réservations payées
      const paidBookings = bookings?.filter(b => b.payment_status === 'paid') || [];
      const averageDuration = paidBookings.length > 0
        ? (paidBookings.reduce((sum, booking) => sum + parseFloat(booking.duration), 0) / paidBookings.length)
        : 0;
      
      // Calculer le taux de conversion basé sur les utilisateurs qui ont commencé une réservation
      const uniqueBookingAttempts = new Set(stepsTracking?.map(track => track.session_id)).size || 0;
      const conversionRate = uniqueBookingAttempts > 0
        ? ((completedBookings / uniqueBookingAttempts) * 100)
        : 0;

      // Simuler les variations pour la démo (à remplacer par des vraies données historiques)
      const variations = {
        totalBookings: '+25.2%',
        completedBookings: '+20%',
        conversionRate: '-14.3%',
        averageDuration: '+15%'
      };

      return {
        totalBookings,
        completedBookings,
        averageDuration,
        conversionRate,
        variations
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
      value: stats?.totalBookings || 0,
      change: stats?.variations.totalBookings,
      icon: Calendar,
      trend: "up"
    },
    {
      title: "Réservations complétées",
      value: stats?.completedBookings || 0,
      change: stats?.variations.completedBookings,
      icon: Users,
      trend: "up"
    },
    {
      title: "Taux de conversion",
      value: `${stats?.conversionRate.toFixed(1)}%`,
      change: stats?.variations.conversionRate,
      icon: TrendingUp,
      trend: "down"
    },
    {
      title: "Durée moyenne",
      value: `${stats?.averageDuration.toFixed(1)}h`,
      change: stats?.variations.averageDuration,
      icon: TrendingUp,
      trend: "up"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </p>
              <h3 className="text-2xl font-bold">
                {metric.value}
              </h3>
              <div className="flex items-center">
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${
                  metric.trend === "up" ? "text-green-500" : "text-red-500"
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
            <metric.icon className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
};