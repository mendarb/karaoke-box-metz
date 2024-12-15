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
      
      // S'assurer que nous avons le bon prix final
      const finalPrice = form.getValues('finalPrice');
      console.log('Prix initial de la réservation:', {
        calculatedPrice,
        finalPrice,
        formValues: form.getValues()
      });

      // Vérifier si l'utilisateur est déjà connecté
      const { data: { session } } = await supabase.auth.getSession();
      
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
        finalPrice: finalPrice !== undefined ? finalPrice : calculatedPrice,
        message: data.message,
        isTestMode: false,
        userId: currentSession.user.id,
        promoCode: data.promoCode,
        promoCodeId: data.promoCodeId,
        userName: data.fullName,
        userPhone: data.phone,
        userEmail: data.email
      };

      console.log('Création de la session de paiement avec les données:', bookingData);
      
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: JSON.stringify(bookingData)
      });

      if (checkoutError) throw checkoutError;
      if (!checkoutData?.url) throw new Error("URL de paiement non reçue");

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