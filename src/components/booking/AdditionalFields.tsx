import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BookingSummary } from "./additional/BookingSummary";
import { PromoCodeField } from "./additional/PromoCodeField";
import { AccountCreation } from "./additional/AccountCreation";
import { usePromoCode } from "../hooks/usePromoCode";

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
  const { isPromoValid, promoData, finalPrice, handlePromoValidated } = usePromoCode(calculatedPrice, form);

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

  return (
    <div className="space-y-6 animate-fadeIn">
      <BookingSummary
        groupSize={groupSize}
        duration={duration}
        calculatedPrice={calculatedPrice}
        isPromoValid={isPromoValid}
        promoCode={promoData?.code}
        finalPrice={finalPrice}
        date={form.getValues("date")}
        timeSlot={form.getValues("timeSlot")}
        message={form.getValues("message")}
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