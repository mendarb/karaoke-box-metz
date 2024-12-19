import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const useBookingSubmit = (
  form: UseFormReturn<any>,
  groupSize: string,
  duration: string,
  calculatedPrice: number,
  setIsSubmitting: (value: boolean) => void
) => {
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation",
          variant: "destructive",
        });
        return;
      }

      // Stocker les données de session pour la redirection après paiement
      const bookingData = {
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        date: data.date,
        timeSlot: data.timeSlot,
        duration,
        groupSize,
        price: calculatedPrice,
        finalPrice: form.getValues('finalPrice') || calculatedPrice,
        message: data.message,
        isTestMode: false,
        userId: session.user.id,
        promoCode: form.getValues('promoCode'),
        promoCodeId: form.getValues('promoCodeId'),
        discountAmount: form.getValues('discountAmount'),
        userName: data.fullName,
        userPhone: data.phone,
        userEmail: data.email
      };

      console.log('Données de réservation:', bookingData);

      // Stocker la session et les données de réservation
      localStorage.setItem('currentBookingSession', JSON.stringify({
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        },
        bookingData
      }));

      // Créer la session de paiement
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: JSON.stringify(bookingData)
      });

      if (checkoutError) {
        console.error('Erreur création checkout:', checkoutError);
        throw checkoutError;
      }

      if (!checkoutData?.url) {
        throw new Error("URL de paiement non reçue");
      }

      console.log('Redirection vers:', checkoutData.url);
      window.location.href = checkoutData.url;

    } catch (error: any) {
      console.error('Erreur soumission réservation:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};