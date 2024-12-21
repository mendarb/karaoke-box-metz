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

      // Créer la réservation
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([{
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

      // Envoyer un email pour créer un compte si l'utilisateur n'existe pas
      const { data: users } = await supabase
        .from('bookings')
        .select('user_id')
        .eq('user_email', data.email)
        .not('user_id', 'is', null)
        .limit(1)
        .single();

      if (!users?.user_id) {
        const { error: signupError } = await supabase.auth.signInWithOtp({
          email: data.email,
          options: {
            data: {
              full_name: data.fullName,
              phone: data.phone,
            }
          }
        });

        if (signupError) {
          console.error('Error sending signup email:', signupError);
          toast({
            title: "Attention",
            description: "Impossible d'envoyer l'email de création de compte",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Email envoyé",
            description: "Un email a été envoyé pour créer un compte",
          });
        }
      }

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