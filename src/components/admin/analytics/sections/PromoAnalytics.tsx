import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export const PromoAnalytics = () => {
  const { data: promoStats, isLoading } = useQuery({
    queryKey: ['analytics-promos'],
    queryFn: async () => {
      // Récupérer les codes promo
      const { data: promoCodes, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .is('deleted_at', null);
      
      if (promoError) throw promoError;

      // Récupérer les réservations avec codes promo
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('promo_code_id')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (bookingsError) throw bookingsError;

      // Calculer les utilisations réelles
      const usageCount = bookings.reduce((acc, booking) => {
        if (booking.promo_code_id) {
          acc[booking.promo_code_id] = (acc[booking.promo_code_id] || 0) + 1;
        }
        return acc;
      }, {});

      // Combiner les données
      return promoCodes?.map(promo => ({
        ...promo,
        actual_uses: usageCount[promo.id] || 0
      }));
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
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Utilisation des codes promo</h3>
        <div className="divide-y">
          {promoStats?.map((promo) => (
            <div key={promo.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{promo.code}</p>
                <p className="text-sm text-muted-foreground">
                  {promo.type === 'percentage' ? `${promo.value}% de réduction` :
                   promo.type === 'fixed_amount' ? `${promo.value}€ de réduction` :
                   'Gratuit'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{promo.actual_uses} utilisations</p>
                <p className="text-sm text-muted-foreground">
                  {promo.max_uses ? `Max: ${promo.max_uses}` : 'Illimité'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Impact des promotions</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Codes les plus utilisés</p>
            <div className="mt-2">
              {promoStats
                ?.sort((a, b) => b.actual_uses - a.actual_uses)
                .slice(0, 3)
                .map((promo) => (
                  <div key={promo.id} className="flex justify-between items-center py-2">
                    <span className="font-medium">{promo.code}</span>
                    <span className="text-sm">{promo.actual_uses} utilisations</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};