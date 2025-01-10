import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, TrendingUp, TrendingDown, Users, Calendar, Clock, Target } from "lucide-react";

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
        .select('*')
        .eq('step', 1) // On ne compte que les sessions qui ont commencé la réservation
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Dernier mois

      if (trackingError) throw trackingError;

      // Calculer les statistiques
      const totalBookings = bookings?.length || 0;
      const completedBookings = bookings?.filter(b => b.payment_status === 'paid').length || 0;
      
      // Calculer la durée moyenne en minutes pour les réservations payées
      const paidBookings = bookings?.filter(b => b.payment_status === 'paid') || [];
      const averageDurationInMinutes = paidBookings.length > 0
        ? Math.round((paidBookings.reduce((sum, booking) => sum + Number(booking.duration), 0) / paidBookings.length) * 60)
        : 0;
      
      // Calculer le taux de conversion basé sur les sessions uniques du dernier mois
      const uniqueBookingAttempts = new Set(stepsTracking?.map(track => track.session_id)).size || 0;
      console.log('Statistiques de conversion:', {
        uniqueBookingAttempts,
        completedBookings,
        stepsTracking: stepsTracking?.length,
        periode: 'dernier mois'
      });
      
      const conversionRate = uniqueBookingAttempts > 0
        ? ((completedBookings / uniqueBookingAttempts) * 100)
        : 0;

      // Calculer les variations (à implémenter avec des vraies données historiques)
      const variations = {
        totalBookings: '+12%',
        completedBookings: '+8%',
        conversionRate: '+5%',
        averageDuration: '+2%'
      };

      return {
        totalBookings,
        completedBookings,
        averageDuration: averageDurationInMinutes,
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
      value: `${Math.round(stats?.conversionRate || 0)}%`,
      change: stats?.variations.conversionRate,
      icon: Target,
      trend: "up"
    },
    {
      title: "Durée moyenne",
      value: `${stats?.averageDuration || 0}min`,
      change: stats?.variations.averageDuration,
      icon: Clock,
      trend: "up"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </p>
              <p className="text-2xl font-bold mt-1">
                {metric.value}
              </p>
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
            <metric.icon className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>
      ))}
    </div>
  );
};