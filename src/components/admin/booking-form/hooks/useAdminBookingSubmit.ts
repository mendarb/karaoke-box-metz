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
    console.log('🎯 Début du processus de réservation admin:', {
      email: data.email,
      fullName: data.fullName,
      date: data.date
    });

    try {
      setIsLoading(true);

      // Trouver ou créer l'utilisateur
      const userId = await findOrCreateUser(data.email, data.fullName, data.phone);
      console.log('✅ Utilisateur trouvé/créé:', userId);

      // Créer la réservation
      const booking = await createBooking(data, userId);
      console.log('✅ Réservation créée:', booking.id);

      // Générer le lien de paiement avec l'ID de la réservation
      const checkoutUrl = await generatePaymentLink({
        ...booking,
        ...data,
        bookingId: booking.id,
        userId: userId
      });
      
      setPaymentLink(checkoutUrl);

      console.log('✅ Processus de réservation admin terminé avec succès');
      toast({
        title: "Réservation créée",
        description: "Le lien de paiement a été généré avec succès.",
      });
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