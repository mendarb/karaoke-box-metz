import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from "lucide-react";

export const BookingAnalytics = () => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['analytics-bookings-details'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');
      
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

  // Analyse par taille de groupe
  const groupSizeData = bookings?.reduce((acc: any, booking) => {
    const size = booking.group_size;
    acc[size] = (acc[size] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(groupSizeData || {}).map(([size, count]) => ({
    name: `${size} pers.`,
    value: count,
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Répartition par taille de groupe</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};