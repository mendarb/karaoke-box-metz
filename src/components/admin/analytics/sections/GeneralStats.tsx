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

      // Récupérer le nombre total d'utilisateurs
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Récupérer les données de tracking des étapes
      const { data: stepsTracking, error: trackingError } = await supabase
        .from('booking_steps_tracking')
        .select('*');

      if (trackingError) throw trackingError;

      // Calculer les statistiques
      const totalBookings = bookings?.length || 0;
      const completedBookings = bookings?.filter(b => b.payment_status === 'paid').length || 0;
      const abandonedBookings = bookings?.filter(b => b.payment_status === 'pending').length || 0;

      // Calculer la durée moyenne uniquement pour les réservations payées
      const paidBookings = bookings?.filter(b => b.payment_status === 'paid') || [];
      const averageDuration = paidBookings.length > 0
        ? (paidBookings.reduce((sum, booking) => sum + parseInt(booking.duration), 0) / paidBookings.length)
        : 0;
      
      // Calculer le taux de conversion basé sur les utilisateurs qui ont commencé une réservation
      const uniqueBookingAttempts = new Set(stepsTracking?.map(track => track.session_id)).size || 0;
      const conversionRate = uniqueBookingAttempts > 0
        ? ((completedBookings / uniqueBookingAttempts) * 100)
        : 0;

      // Calculer le taux de finalisation
      const completionRate = totalBookings > 0
        ? ((completedBookings / totalBookings) * 100)
        : 0;

      return {
        totalBookings,
        completedBookings,
        abandonedBookings,
        averageDuration,
        conversionRate,
        completionRate,
        totalUsers,
        uniqueBookingAttempts
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
      change: "+25.2%",
      icon: Calendar,
      trend: "up"
    },
    {
      title: "Réservations complétées",
      value: stats?.completedBookings || 0,
      change: "+20%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Taux de conversion",
      value: `${stats?.conversionRate.toFixed(1)}%`,
      change: "-14.3%",
      icon: TrendingUp,
      trend: "down"
    },
    {
      title: "Durée moyenne",
      value: `${stats?.averageDuration.toFixed(1)}h`,
      change: "+15%",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {metric.value}
              </h3>
              <div className="flex items-center mt-1">
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