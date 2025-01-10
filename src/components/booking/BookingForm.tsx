import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useUserState } from "@/hooks/useUserState";
import { useBookingSession } from "@/hooks/useBookingSession";
import { Button } from "@/components/ui/button";
import { BookingSteps } from "./BookingSteps";
import { useBookingSteps } from "@/hooks/useBookingSteps";
import { UserInfoStep } from "./steps/UserInfoStep";
import { DateTimeStep } from "./steps/DateTimeStep";
import { GroupSizeStep } from "./steps/GroupSizeStep";
import { PaymentStep } from "./steps/PaymentStep";
import { createBooking } from "@/lib/api/bookings";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

export type BookingFormData = {
  email: string;
  fullName: string;
  phone: string;
  date: string;
  timeSlot: string;
  duration: string;
  groupSize: string;
  message?: string;
  calculatedPrice?: number;
};

export const BookingForm = () => {
  const { user } = useUserState();
  const { trackStep } = useBookingSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const router = useRouter();
  const { toast } = useToast();
  const steps = useBookingSteps(currentStep);

  const form = useForm<BookingFormData>({
    defaultValues: {
      email: user?.email || "",
      fullName: user?.full_name || "",
      phone: user?.phone || "",
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
        router.push(url);
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
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {currentStep === 1 && (
          <UserInfoStep
            form={form}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <DateTimeStep
            form={form}
            onNext={handleNext}
          />
        )}

        {currentStep === 3 && (
          <GroupSizeStep
            form={form}
            onNext={handleNext}
            onPriceCalculated={handlePriceCalculated}
          />
        )}

        {currentStep === 4 && (
          <PaymentStep
            form={form}
            isLoading={isLoading}
            calculatedPrice={calculatedPrice}
          />
        )}
      </form>
    </div>
  );
};