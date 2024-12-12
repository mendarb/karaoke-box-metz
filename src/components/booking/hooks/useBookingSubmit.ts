import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { checkTimeSlotAvailability } from "../utils/bookingValidation";
import { useQuery } from "@tanstack/react-query";

export const useBookingSubmit = (
  form: UseFormReturn<any>,
  groupSize: string,
  duration: string,
  calculatedPrice: number,
  setIsSubmitting: (value: boolean) => void
) => {
  const { toast } = useToast();

  const { data: settings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('key', 'booking_settings')
        .single();

      if (error) throw error;
      return data?.value;
    }
  });

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log('Starting submission with data:', { ...data, groupSize, duration, calculatedPrice });

      // Vérifier la session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation.",
          variant: "destructive",
        });
        return false;
      }

      // Vérifier la disponibilité du créneau
      const isAvailable = await checkTimeSlotAvailability(data.date, data.timeSlot, duration);
      if (!isAvailable) {
        console.log('Time slot not available');
        return false;
      }

      // Créer la session de paiement
      console.log('Creating checkout session with test mode:', settings?.isTestMode);
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: JSON.stringify({
          price: calculatedPrice,
          groupSize,
          duration,
          date: data.date,
          timeSlot: data.timeSlot,
          message: data.message,
          userEmail: data.email,
          userName: data.fullName,
          userPhone: data.phone,
          isTestMode: settings?.isTestMode || false
        })
      });

      console.log('Checkout response:', { checkoutData, checkoutError });

      if (checkoutError) throw checkoutError;
      if (!checkoutData?.url) throw new Error("URL de paiement non reçue");

      window.location.href = checkoutData.url;
      return true;
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};