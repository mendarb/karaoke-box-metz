import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUserState } from "@/hooks/useUserState";
import { useBookingSession } from "@/hooks/useBookingSession";
import { Button } from "@/components/ui/button";
import { BookingSteps } from "@/components/BookingSteps";
import { useBookingSteps } from "@/hooks/useBookingSteps";
import { createBooking } from "@/lib/api/bookings";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { Form } from "@/components/ui/form";

export type BookingFormData = {
  email: string;
  fullName: string;
  phone: string;
  date: Date | undefined;
  timeSlot: string;
  duration: string;
  groupSize: string;
  message?: string;
  calculatedPrice?: number;
  isTestMode?: boolean;
  promoCode?: string;
  promoCodeId?: string;
  finalPrice?: number;
};

export const BookingForm = () => {
  const { user } = useUserState();
  const { trackStep } = useBookingSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const steps = useBookingSteps(currentStep);

  const form = useForm<BookingFormData>({
    defaultValues: {
      email: user?.email || "",
      fullName: user?.user_metadata?.full_name || "",
      phone: user?.user_metadata?.phone || "",
    },
  });

  useEffect(() => {
    trackStep(1, "Coordonnées");
  }, []);

  const handleNext = async () => {
    await trackStep(currentStep, getStepName(currentStep), true);
    setCurrentStep(currentStep + 1);
    await trackStep(currentStep + 1, getStepName(currentStep + 1));
  };

  const handleSubmit = async (data: BookingFormData) => {
    try {
      setIsLoading(true);
      await trackStep(currentStep, getStepName(currentStep), true);

      const bookingData = {
        ...data,
        price: calculatedPrice,
        userId: user?.id,
      };

      const { success, error, bookingId, url } = await createBooking(bookingData);

      if (success && url) {
        if (bookingId) {
          await trackStep(4, "Paiement", true, bookingId);
        }
        trackEvent("booking_created", {
          booking_id: bookingId,
          price: calculatedPrice,
        });
        navigate(url);
      } else {
        throw new Error(error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la réservation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepName = (step: number): string => {
    switch (step) {
      case 1:
        return "Coordonnées";
      case 2:
        return "Date et heure";
      case 3:
        return "Groupe";
      case 4:
        return "Paiement";
      default:
        return "Inconnu";
    }
  };

  const handlePriceCalculated = (price: number) => {
    setCalculatedPrice(price);
    form.setValue("calculatedPrice", price);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <BookingSteps steps={steps} currentStep={currentStep} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Vos coordonnées</h2>
                  <p className="text-gray-500">
                    Entrez vos informations de contact pour la réservation
                  </p>
                </div>
              </div>
              <Button onClick={handleNext} type="button">
                Continuer
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Date et heure</h2>
                  <p className="text-gray-500">
                    Choisissez votre créneau de réservation
                  </p>
                </div>
              </div>
              <Button onClick={handleNext} type="button">
                Continuer
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Taille du groupe</h2>
                  <p className="text-gray-500">
                    Indiquez le nombre de personnes et la durée souhaitée
                  </p>
                </div>
              </div>
              <Button onClick={handleNext} type="button">
                Continuer
              </Button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Paiement</h2>
                  <p className="text-gray-500">
                    Finalisez votre réservation
                  </p>
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Chargement..." : "Payer"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};