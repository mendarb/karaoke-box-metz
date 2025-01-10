import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Users, Calendar, Clock, TrendingUp } from "lucide-react";

export const GeneralStats = () => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['analytics-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .is('deleted_at', null);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalBookings = bookings?.length || 0;
  const completedBookings = bookings?.filter(b => b.payment_status === 'paid').length || 0;
  const conversionRate = totalBookings > 0 
    ? ((completedBookings / totalBookings) * 100).toFixed(1) 
    : '0';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Total réservations</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{totalBookings}</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Réservations complétées</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{completedBookings}</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Taux de conversion</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{conversionRate}%</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Durée moyenne</h3>
        </div>
        <p className="text-2xl font-bold mt-2">
          {bookings?.reduce((acc, b) => acc + parseInt(b.duration), 0) / totalBookings || 0}h
        </p>
      </Card>
    </div>
  );
};