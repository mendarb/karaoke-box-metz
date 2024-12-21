import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { findOrCreateUser } from "./services/userService";
import { createBooking, generatePaymentLink } from "./services/bookingService";

export const useAdminBookingSubmit = (form: UseFormReturn<any>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      // Trouver ou créer l'utilisateur
      const userId = await findOrCreateUser(data.email, data.fullName, data.phone);

      // Créer la réservation
      const booking = await createBooking(data, userId);

      // Générer le lien de paiement
      const checkoutUrl = await generatePaymentLink(booking, data);
      setPaymentLink(checkoutUrl);

      toast({
        title: "Réservation créée",
        description: "Le lien de paiement a été généré avec succès.",
      });
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
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