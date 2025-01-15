import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { findOrCreateUser } from "./services/userService";
import { generatePaymentLink } from "./services/bookingService";
import { supabase } from "@/lib/supabase";

export const useAdminBookingSubmit = (form: UseFormReturn<any>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    console.log('🎯 Début du processus de réservation admin:', {
      email: data.email,
      fullName: data.fullName,
      date: data.date,
      finalPrice: data.finalPrice,
      calculatedPrice: data.calculatedPrice,
      promoCode: data.promoCode,
      paymentMethod: data.paymentMethod
    });

    try {
      setIsLoading(true);

      // Trouver l'utilisateur (sans en créer un nouveau)
      const userId = await findOrCreateUser(data.email, data.fullName, data.phone);
      console.log('✅ Utilisateur trouvé:', userId);

      if (data.paymentMethod === 'stripe') {
        // Générer le lien de paiement uniquement pour Stripe
        const checkoutUrl = await generatePaymentLink({
          ...data,
          userId: userId,
          sendEmail: true
        });
        setPaymentLink(checkoutUrl);
      } else {
        // Pour SumUp et espèces, créer directement la réservation
        const { error } = await supabase
          .from('bookings')
          .insert([
            {
              user_id: userId,
              user_email: data.email,
              user_name: data.fullName,
              user_phone: data.phone,
              date: data.date,
              time_slot: data.timeSlot,
              duration: data.duration,
              group_size: data.groupSize,
              price: data.calculatedPrice,
              message: data.message,
              payment_status: 'pending',
              status: 'pending',
              is_test_booking: data.isTestMode,
              promo_code_id: data.promoCodeId,
              payment_method: data.paymentMethod
            }
          ]);

        if (error) {
          throw error;
        }

        toast({
          title: "Réservation créée",
          description: `La réservation a été créée avec succès (paiement par ${data.paymentMethod === 'sumup' ? 'carte' : 'espèces'})`,
        });
      }

      console.log('✅ Processus de réservation admin terminé avec succès');
    } catch (error: any) {
      console.error('❌ Erreur dans le processus de réservation admin:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    paymentLink,
    handleSubmit,
    setPaymentLink
  };
};