import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Users, Calendar, Clock, TrendingUp, CreditCard } from "lucide-react";

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Tentatives de réservation</h3>
        </div>
        <div>
          <p className="text-2xl font-bold mt-2">{stats?.uniqueBookingAttempts || 0}</p>
          <p className="text-sm text-muted-foreground">
            sessions uniques
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Réservations complétées</h3>
        </div>
        <div>
          <p className="text-2xl font-bold mt-2">{stats?.completedBookings || 0}</p>
          <p className="text-sm text-muted-foreground">
            sur {stats?.totalBookings || 0} tentatives
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Taux de conversion</h3>
        </div>
        <div>
          <p className="text-2xl font-bold mt-2">{stats?.conversionRate.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">
            des sessions aboutissent à une réservation
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Taux de finalisation</h3>
        </div>
        <div>
          <p className="text-2xl font-bold mt-2">{stats?.completionRate.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">
            des réservations sont payées
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Durée moyenne réservée</h3>
        </div>
        <div>
          <p className="text-2xl font-bold mt-2">
            {stats?.averageDuration.toFixed(1)} heures
          </p>
          <p className="text-sm text-muted-foreground">
            par réservation complétée
          </p>
        </div>
      </Card>
    </div>
  );
};