import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/lib/supabase";

interface PriceCalculatorProps {
  groupSize: string;
  duration: string;
  onPriceCalculated?: (price: number) => void;
}

export const PriceCalculator = ({ groupSize, duration, onPriceCalculated }: PriceCalculatorProps) => {
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    const calculatePrice = () => {
      const hours = parseInt(duration) || 0;
      const size = groupSize === "6+" ? 6 : parseInt(groupSize) || 0;

      // Base price calculation
      let basePrice = 0;
      if (size <= 3) basePrice = 30;
      else if (size === 4) basePrice = 40;
      else if (size >= 5) basePrice = 50;

      // Calculate total with discounts
      let totalPrice = basePrice;
      let totalDiscount = 0;

      if (hours > 1) {
        for (let i = 1; i < hours; i++) {
          const discountedHourPrice = basePrice * 0.9;
          totalPrice += discountedHourPrice;
          totalDiscount += basePrice * 0.1;
        }
      }

      const finalPrice = Math.round(totalPrice);
      const finalDiscount = Math.round(totalDiscount);
      const discountPercent = hours > 1 
        ? Math.round((totalDiscount / (basePrice * hours)) * 100)
        : 0;

      setPrice(finalPrice);
      setDiscount(finalDiscount);
      setDiscountPercentage(discountPercent);
      
      if (onPriceCalculated) {
        onPriceCalculated(finalPrice);
      }
    };

    if (groupSize && duration) {
      calculatePrice();
    }
  }, [groupSize, duration, onPriceCalculated]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour effectuer une réservation.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { price, groupSize, duration },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("URL de paiement non reçue");

      window.location.href = data.url;
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors de la redirection vers le paiement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!price) return null;

  return (
    <div className={`${isMobile ? 'mt-3 p-4' : 'mt-4 p-6'} bg-gradient-to-br from-violet-50/50 to-violet-100/50 backdrop-blur-sm rounded-2xl border border-violet-100/50 shadow-lg animate-fadeIn`}>
      <p className="text-xl sm:text-2xl font-bold text-violet-900 mb-2">
        Prix total : {price}€
      </p>
      {discount > 0 && (
        <p className="text-sm text-green-600 font-medium mb-2 flex items-center gap-2">
          Économie : {discount}€ 
          <span className="bg-green-100/80 backdrop-blur-sm text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
            -{discountPercentage}%
          </span>
        </p>
      )}
      <Button
        onClick={handlePayment}
        className="w-full bg-violet-600 hover:bg-violet-700"
        disabled={isLoading}
      >
        {isLoading ? "Redirection..." : "Procéder au paiement"}
      </Button>
    </div>
  );
};