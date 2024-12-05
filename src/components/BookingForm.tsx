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

export const BookingForm = () => {
  const { toast } = useToast();
  const [groupSize, setGroupSize] = useState("");
  const [duration, setDuration] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const form = useForm();

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
    setCalculatedPrice(price);
  };

  const checkTimeSlotAvailability = async (date: Date, timeSlot: string, duration: string) => {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date.toISOString().split('T')[0])
      .eq('time_slot', timeSlot);

    if (error) {
      console.error('Error checking availability:', error);
      return false;
    }

    // Si des réservations existent pour ce créneau
    if (bookings && bookings.length > 0) {
      toast({
        title: "Créneau non disponible",
        description: "Ce créneau est déjà réservé. Veuillez choisir un autre horaire.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const onSubmit = async (data: any) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour effectuer une réservation.",
            variant: "destructive",
          });
          return;
        }

        // Vérifier la disponibilité du créneau
        const isAvailable = await checkTimeSlotAvailability(data.date, data.timeSlot, duration);
        if (!isAvailable) {
          return;
        }

        // Sauvegarder la réservation dans la base de données
        const { error: bookingError } = await supabase
          .from('bookings')
          .insert([
            {
              user_id: session.user.id,
              date: data.date,
              time_slot: data.timeSlot,
              duration: duration,
              group_size: groupSize,
              status: 'pending',
              price: calculatedPrice,
            }
          ]);

        if (bookingError) {
          console.error('Booking error:', bookingError);
          throw bookingError;
        }

        // Créer la session de paiement
        const { data: response, error } = await supabase.functions.invoke('create-checkout', {
          body: {
            ...data,
            price: calculatedPrice,
            groupSize,
            duration,
          }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw error;
        }

        if (response?.url) {
          window.location.href = response.url;
        } else {
          throw new Error("URL de paiement non reçue");
        }
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
          variant: "destructive",
        });
      }
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
        return <DateTimeFields form={form} />;
      case 3:
        return (
          <GroupSizeAndDurationFields
            form={form}
            onGroupSizeChange={setGroupSize}
            onDurationChange={setDuration}
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
          >
            {currentStep === 4 ? "Procéder au paiement" : "Suivant"}
          </Button>
        </div>
      </form>
    </Form>
  );
};