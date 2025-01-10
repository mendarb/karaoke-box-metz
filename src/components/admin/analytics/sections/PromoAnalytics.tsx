import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export const PromoAnalytics = () => {
  const { data: promoStats, isLoading } = useQuery({
    queryKey: ['analytics-promos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promo_codes')
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

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Utilisation des codes promo</h3>
        <div className="divide-y">
          {promoStats?.map((promo) => (
            <div key={promo.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{promo.code}</p>
                <p className="text-sm text-muted-foreground">{promo.description}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{promo.current_uses} utilisations</p>
                <p className="text-sm text-muted-foreground">
                  {promo.max_uses ? `Max: ${promo.max_uses}` : 'Illimité'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};