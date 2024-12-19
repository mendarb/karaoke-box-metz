import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useBookingSettings } from "../date-time/hooks/useBookingSettings";

export const useBookingSubmit = (
  form: UseFormReturn<any>,
  groupSize: string,
  duration: string,
  calculatedPrice: number,
  setIsSubmitting: (value: boolean) => void
) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: settings } = useBookingSettings();

  const handleSubmit = async (data: any) => {
    try {
      console.log('🚀 Starting booking submission process', { data });
      setIsSubmitting(true);
      
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session check:', { session });
      
      if (!session) {
        console.error('❌ No active session found');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Session active:', session.user.email);

      const isTestMode = settings?.isTestMode || false;
      console.log('Mode test activé:', isTestMode);

      // Préparer les données de réservation
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
        isTestMode,
        userId: session.user.id,
        promoCode: form.getValues('promoCode'),
        promoCodeId: form.getValues('promoCodeId'),
        discountAmount: form.getValues('discountAmount'),
        userName: data.fullName,
        userPhone: data.phone,
        userEmail: data.email
      };

      console.log('📦 Données de réservation préparées:', bookingData);

      // Stocker la session et les données de réservation
      const sessionData = {
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        },
        bookingData
      };
      console.log('💾 Storing session data:', sessionData);
      localStorage.setItem('currentBookingSession', JSON.stringify(sessionData));

      console.log('💳 Création de la session de paiement...');
      
      // Créer la session de paiement
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: bookingData
      });

      console.log('📫 Checkout response:', { checkoutData, checkoutError });

      if (checkoutError) {
        console.error('❌ Erreur création checkout:', checkoutError);
        throw checkoutError;
      }

      if (!checkoutData?.url) {
        console.error('❌ URL de paiement non reçue');
        throw new Error("URL de paiement non reçue");
      }

      console.log('✅ Redirection vers:', checkoutData.url);
      window.location.href = checkoutData.url;

    } catch (error: any) {
      console.error('❌ Erreur soumission réservation:', error);
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