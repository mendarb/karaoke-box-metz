import { Card } from "@/components/ui/card";
import { PeriodSelection } from "../AnalyticsContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PromoAnalyticsProps {
  period: PeriodSelection;
}

export const PromoAnalytics = ({ period }: PromoAnalyticsProps) => {
  const { data: promoStats, isLoading } = useQuery({
    queryKey: ['promo-analytics', period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promo_codes')
        .select(`
          code,
          uses,
          bookings (
            id,
            total_amount,
            created_at
          )
        `);
      
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

  const chartData = promoStats?.map(promo => ({
    name: promo.code,
    uses: promo.uses,
    revenue: promo.bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
  })) || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Utilisation des codes promo</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uses" fill="#8884d8" name="Utilisations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Revenus par code promo</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenus" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};