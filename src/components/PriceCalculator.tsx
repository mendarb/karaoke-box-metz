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
      let basePrice = 0;

      // Convert groupSize to number, handling "6+" case
      const size = groupSize === "6+" ? 6 : parseInt(groupSize) || 0;

      // Base price per hour based on group size
      if (size <= 3) {
        basePrice = 30; // 1-3 people: 30€/hour
      } else if (size === 4) {
        basePrice = 40; // 4 people: 40€/hour
      } else if (size >= 5 && size <= 10) {
        basePrice = 50; // 5-10 people: 50€/hour
      }

      // Calculate total price with discount for additional hours
      let totalPrice = basePrice; // First hour at full price
      let totalDiscount = 0;
      
      // Apply 10% discount for each additional hour
      if (hours > 1) {
        for (let i = 1; i < hours; i++) {
          const discountedPrice = basePrice * 0.9;
          totalPrice += discountedPrice;
          totalDiscount += basePrice * 0.1;
        }
      }

      // Calculate total discount percentage
      const discountPercent = hours > 1 
        ? Math.round((totalDiscount / (totalPrice + totalDiscount)) * 100)
        : 0;

      setPrice(Math.round(totalPrice));
      setDiscount(Math.round(totalDiscount));
      setDiscountPercentage(discountPercent);
      
      // Notify parent component of the calculated price
      if (onPriceCalculated) {
        onPriceCalculated(Math.round(totalPrice));
      }
    };

    calculatePrice();
  }, [groupSize, duration, onPriceCalculated]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      console.log('Initiating payment process...');
      
      // Vérifier l'authentification
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      console.log('Auth session:', session);
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!session?.access_token) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour effectuer une réservation.",
          variant: "destructive",
        });
        return;
      }

      // Préparer les données pour la fonction Edge
      const payload = {
        price,
        groupSize,
        duration,
      };
      console.log('Sending payload to create-checkout:', payload);

      // Appeler la fonction Edge
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: payload,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('Response from create-checkout:', data);

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data?.url) {
        throw new Error("URL de paiement non reçue");
      }

      // Rediriger vers Stripe
      window.location.href = data.url;
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue lors de la redirection vers le paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${isMobile ? 'mt-3 p-4' : 'mt-4 p-6'} bg-gradient-to-br from-violet-50/50 to-violet-100/50 backdrop-blur-sm rounded-2xl border border-violet-100/50 shadow-lg animate-fadeIn`}>
      <p className="text-xl sm:text-2xl font-bold text-violet-900 mb-2">
        Prix total : {price}€
      </p>
      {discount > 0 && (
        <p className="text-sm text-green-600 font-medium mb-2 flex items-center gap-2">
          Économie réalisée : {discount}€ 
          <span className="bg-green-100/80 backdrop-blur-sm text-green-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
            -{discountPercentage}% au total
          </span>
        </p>
      )}
      <p className="text-xs sm:text-sm text-gray-500 mb-4">
        *Prix indicatif, peut varier selon les options choisies
      </p>
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