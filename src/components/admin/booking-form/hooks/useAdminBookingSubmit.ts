import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { createCheckoutSession } from "@/services/checkoutService";

export const useAdminBookingSubmit = (form: UseFormReturn<any>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      // Vérifier si l'utilisateur existe déjà
      const { data: existingUsers } = await supabase
        .from('bookings')
        .select('user_id')
        .eq('user_email', data.email)
        .not('user_id', 'is', null)
        .limit(1)
        .single();

      let userId = existingUsers?.user_id;

      // Si l'utilisateur n'existe pas, on récupère son ID après l'envoi de l'email
      if (!userId) {
        const { data: authData } = await supabase.auth.signInWithOtp({
          email: data.email,
          options: {
            data: {
              full_name: data.fullName,
              phone: data.phone,
            }
          }
        });

        // On attend un peu pour laisser le temps à l'utilisateur d'être créé
        await new Promise(resolve => setTimeout(resolve, 1000));

        // On récupère l'ID de l'utilisateur nouvellement créé
        const { data: newUser } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', data.email)
          .single();

        userId = newUser?.id;
      }

      // Créer la réservation avec l'ID de l'utilisateur
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([{
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
          status: 'pending',
          payment_status: 'unpaid',
          is_test_booking: false,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      // Générer le lien de paiement
      const checkoutUrl = await createCheckoutSession({
        bookingId: booking.id,
        userEmail: data.email,
        date: data.date,
        timeSlot: data.timeSlot,
        duration: data.duration,
        groupSize: data.groupSize,
        price: data.calculatedPrice,
        finalPrice: data.calculatedPrice,
        message: data.message,
        userName: data.fullName,
        userPhone: data.phone,
        isTestMode: false,
      });

      setPaymentLink(checkoutUrl);

      toast({
        title: "Réservation créée",
        description: "Le lien de paiement a été généré avec succès.",
      });
    } catch (error: any) {
      console.error('Error creating booking:', error);
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