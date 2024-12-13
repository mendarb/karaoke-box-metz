import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { PersonalInfoFields } from "./booking/PersonalInfoFields";
import { DateTimeFields } from "./booking/DateTimeFields";
import { GroupSizeAndDurationFields } from "./booking/GroupSizeAndDurationFields";
import { AdditionalFields } from "./booking/AdditionalFields";
import { BookingSteps, type BookingStep } from "./BookingSteps";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const BookingForm = () => {
  const { toast } = useToast();
  const [groupSize, setGroupSize] = useState("");
  const [duration, setDuration] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableHours, setAvailableHours] = useState(4);
  const form = useForm();

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

  const steps: BookingStep[] = [
    {
      id: 1,
      name: "Informations personnelles",
      description: "Vos coordonnées",
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      name: "Date et heure",
      description: "Choisissez votre créneau",
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      name: "Groupe et durée",
      description: "Taille du groupe et durée",
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      name: "Finalisation",
      description: "Informations complémentaires",
      completed: currentStep > 4,
      current: currentStep === 4,
    },
  ];

  const handlePriceCalculated = (price: number) => {
    console.log('Price calculated:', price);
    setCalculatedPrice(price);
  };

  const handleAvailabilityChange = (date: Date | undefined, hours: number) => {
    setSelectedDate(date);
    setAvailableHours(hours);
    console.log('Available hours updated:', hours);
  };

  const onSubmit = async (data: any) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Starting submission with data:', { 
        ...data, 
        groupSize, 
        duration, 
        calculatedPrice,
        isTestMode: settings?.isTestMode 
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

      // Créer la session de paiement
      console.log('Creating checkout session...');
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
          isTestMode: settings?.isTestMode || false,
          userId: currentSession.user.id // Ajout de l'ID utilisateur
        })
      });

      console.log('Checkout response:', { checkoutData, checkoutError });

      if (checkoutError) throw checkoutError;
      if (!checkoutData?.url) throw new Error("URL de paiement non reçue");

      // Stocker la session en cours
      localStorage.setItem('currentSession', JSON.stringify(currentSession));

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

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoFields form={form} />;
      case 2:
        return <DateTimeFields 
          form={form} 
          onAvailabilityChange={handleAvailabilityChange}
        />;
      case 3:
        return (
          <GroupSizeAndDurationFields
            form={form}
            onGroupSizeChange={setGroupSize}
            onDurationChange={setDuration}
            onPriceCalculated={handlePriceCalculated}
            availableHours={availableHours}
          />
        );
      case 4:
        return (
          <AdditionalFields 
            form={form} 
            calculatedPrice={calculatedPrice}
            groupSize={groupSize}
            duration={duration}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BookingSteps steps={steps} currentStep={currentStep} />
        
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between space-x-4 pb-20 sm:pb-0">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="w-full"
            >
              Précédent
            </Button>
          )}
          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={isSubmitting}
          >
            {currentStep === 4 ? (isSubmitting ? "Traitement..." : "Procéder au paiement") : "Suivant"}
          </Button>
        </div>
      </form>
    </Form>
  );
};