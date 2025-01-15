import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { findOrCreateUser } from "./services/userService";
import { generatePaymentLink } from "./services/bookingService";

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
        const response = await generatePaymentLink({
          ...data,
          userId: userId,
          sendEmail: false,
          paymentMethod: data.paymentMethod
        });
        
        if (response) {
          toast({
            title: "Réservation créée",
            description: `La réservation a été créée avec succès (paiement par ${data.paymentMethod === 'sumup' ? 'carte' : 'espèces'})`,
          });
        }
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