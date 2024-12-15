import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { UseFormReturn } from "react-hook-form";

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
      setIsSubmitting(true);
      
      // Récupérer le prix final (avec ou sans code promo)
      const finalPrice = form.getValues('finalPrice') || calculatedPrice;
      const promoCode = form.getValues('promoCode');
      const promoCodeId = form.getValues('promoCodeId');
      const discountAmount = form.getValues('discountAmount') || 0;

      console.log('Prix initial de la réservation:', {
        calculatedPrice,
        finalPrice,
        promoCode,
        promoCodeId,
        discountAmount,
        formValues: form.getValues()
      });

      // Vérifier si l'utilisateur est déjà connecté
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session utilisateur:', session);
      
      // Si l'utilisateur n'est pas connecté et souhaite créer un compte
      if (!session?.access_token && data.createAccount && data.password) {
        console.log('Creating new account for:', data.email);
        
        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              phone: data.phone
            },
          },
        });

        if (signUpError) {
          console.error('Sign up error:', signUpError);
          toast({
            title: "Erreur lors de la création du compte",
            description: signUpError.message,
            variant: "destructive",
          });
          return;
        }

        // Attendre que la session soit créée
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInError) {
          console.error('Sign in error:', signInError);
          toast({
            title: "Erreur lors de la connexion",
            description: signInError.message,
            variant: "destructive",
          });
          return;
        }
      }

      // Vérifier à nouveau la session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession?.access_token) {
        console.error('No session found after account creation/login');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation.",
          variant: "destructive",
        });
        return;
      }

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
        finalPrice,
        message: data.message,
        isTestMode: false,
        userId: currentSession.user.id,
        promoCode,
        promoCodeId,
        userName: data.fullName,
        userPhone: data.phone,
        userEmail: data.email,
        discountAmount
      };

      console.log('Création de la session de paiement avec les données:', bookingData);
      
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: JSON.stringify(bookingData)
      });

      if (checkoutError) {
        console.error('Checkout error:', checkoutError);
        throw checkoutError;
      }
      
      if (!checkoutData?.url) {
        console.error('No checkout URL received');
        throw new Error("URL de paiement non reçue");
      }

      console.log('Redirection vers:', checkoutData.url);
      window.location.href = checkoutData.url;
      
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};