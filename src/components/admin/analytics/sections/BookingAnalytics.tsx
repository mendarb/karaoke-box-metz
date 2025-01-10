import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from "lucide-react";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

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

  const groupSizeChartData = Object.entries(groupSizeData || {}).map(([size, count]) => ({
    name: `${size} pers.`,
    value: count,
  }));

  // Analyse par durée
  const durationData = bookings?.reduce((acc: any, booking) => {
    const duration = `${booking.duration}h`;
    acc[duration] = (acc[duration] || 0) + 1;
    return acc;
  }, {});

  const durationChartData = Object.entries(durationData || {}).map(([duration, count]) => ({
    name: duration,
    value: count,
  }));

  // Analyse par jour de la semaine
  const dayData = bookings?.reduce((acc: any, booking) => {
    const date = new Date(booking.date);
    const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const dayChartData = Object.entries(dayData || {}).map(([day, count]) => ({
    name: day,
    value: count,
  }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Répartition par taille de groupe</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={groupSizeChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {groupSizeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Répartition par durée</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={durationChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Répartition par jour de la semaine</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};