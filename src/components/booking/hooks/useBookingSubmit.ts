import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { UseFormReturn } from "react-hook-form";
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

  // Fetch booking settings to check test mode
  const { data: settings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('key', 'booking_settings')
        .maybeSingle();

      if (error) throw error;
      return data?.value;
    },
  });

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log('Starting submission with data:', { 
        ...data, 
        groupSize, 
        duration, 
        calculatedPrice,
        finalPrice: data.finalPrice 
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

      const isAvailable = await checkTimeSlotAvailability(data.date, data.timeSlot, duration);
      if (!isAvailable) {
        console.log('Time slot not available');
        toast({
          title: "Créneau non disponible",
          description: "Ce créneau n'est plus disponible. Veuillez en choisir un autre.",
          variant: "destructive",
        });
        return;
      }

      // Stocker les données de réservation et la session dans le localStorage
      const bookingData = {
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        date: data.date,
        timeSlot: data.timeSlot,
        duration,
        groupSize,
        price: calculatedPrice,
        finalPrice: data.finalPrice,
        message: data.message,
        isTestMode: settings?.isTestMode || false,
        userId: currentSession.user.id,
        promoCode: data.promoCode,
        promoCodeId: data.promoCodeId
      };

      console.log('Storing booking data in localStorage:', bookingData);
      localStorage.setItem('currentBookingSession', JSON.stringify({
        session: currentSession,
        bookingData
      }));

      console.log('Creating checkout session...');
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: JSON.stringify(bookingData)
      });

      console.log('Checkout response:', { checkoutData, checkoutError });

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
