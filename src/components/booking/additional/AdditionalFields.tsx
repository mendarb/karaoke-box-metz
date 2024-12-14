import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BookingSummary } from "./BookingSummary";
import { PromoCodeField } from "./PromoCodeField";
import { AccountCreation } from "./AccountCreation";

interface AdditionalFieldsProps {
  form: UseFormReturn<any>;
  calculatedPrice: number;
  groupSize: string;
  duration: string;
}

export const AdditionalFields = ({ 
  form, 
  calculatedPrice, 
  groupSize, 
  duration 
}: AdditionalFieldsProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [promoData, setPromoData] = useState<any>(null);
  const [finalPrice, setFinalPrice] = useState(calculatedPrice);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  const handlePromoValidated = (isValid: boolean, promoCode?: any) => {
    setIsPromoValid(isValid);
    setPromoData(promoCode);
    
    if (isValid && promoCode) {
      let newPrice = calculatedPrice;
      
      if (promoCode.type === 'percentage' && promoCode.value) {
        newPrice = calculatedPrice * (1 - promoCode.value / 100);
      } else if (promoCode.type === 'fixed_amount' && promoCode.value) {
        newPrice = Math.max(0, calculatedPrice - promoCode.value);
      } else if (promoCode.type === 'free') {
        newPrice = 0;
      }
      
      setFinalPrice(newPrice);
    } else {
      setFinalPrice(calculatedPrice);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <BookingSummary
        groupSize={groupSize}
        duration={duration}
        calculatedPrice={calculatedPrice}
        isPromoValid={isPromoValid}
        promoCode={promoData?.code}
        finalPrice={finalPrice}
      />

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Message (optionnel)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Informations complémentaires pour votre réservation..." 
                className="resize-none" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <PromoCodeField 
        onPromoValidated={handlePromoValidated}
        form={form}
      />

      <AccountCreation 
        isAuthenticated={isAuthenticated}
        form={form}
        userEmail={form.getValues("email")}
      />
    </div>
  );
};