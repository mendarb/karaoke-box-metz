import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { BookingSteps, Step } from "@/components/BookingSteps";
import { DateTimeFields } from "./DateTimeFields";
import { GroupSizeAndDurationFields } from "./GroupSizeAndDurationFields";
import { AdditionalFields } from "./AdditionalFields";
import { useBookingForm } from "./hooks/useBookingForm";
import { Calendar, Users, CreditCard } from "lucide-react";
import { PromoCodePopup } from "./PromoCodePopup";
import { useUserState } from "@/hooks/useUserState";
import { useToast } from "@/hooks/use-toast";
import { BookingFormActions } from "./form-actions/BookingFormActions";

export const BookingFormWrapper = () => {
  const { user } = useUserState();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableHours, setAvailableHours] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [groupSize, setGroupSize] = useState("");
  const [duration, setDuration] = useState("");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      email: user?.email || "",
      fullName: "",
      phone: "",
      date: undefined,
      timeSlot: "",
      duration: "",
      groupSize: "",
      message: "",
      promoCode: "",
      promoCodeId: null,
      finalPrice: 0,
      createAccount: false,
      password: "",
    },
  });

  const { isSubmitting, onSubmit } = useBookingForm({
    form,
    groupSize,
    duration,
    calculatedPrice,
  });

  // Charger les détails d'une réservation sauvegardée si disponible
  useEffect(() => {
    const savedBooking = sessionStorage.getItem("savedBooking");
    if (savedBooking) {
      const booking = JSON.parse(savedBooking);
      form.setValue("date", booking.date);
      form.setValue("timeSlot", booking.time_slot);
      form.setValue("duration", booking.duration);
      form.setValue("groupSize", booking.group_size);
      form.setValue("message", booking.message || "");
      setGroupSize(booking.group_size);
      setDuration(booking.duration);
      // Utiliser l'étape spécifiée ou par défaut l'étape 2
      setCurrentStep(booking.currentStep || 2);
      sessionStorage.removeItem("savedBooking");

      // Afficher un guide pour l'utilisateur
      toast({
        title: "✨ Réservation chargée",
        description: "Vous pouvez maintenant continuer votre réservation",
      });
    }
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const steps: Step[] = [
    {
      id: 1,
      title: "Date & Heure",
      description: "Choisissez votre créneau",
      icon: <Calendar className="h-5 w-5" />,
      completed: currentStep > 1,
      current: currentStep === 1,
      tooltip: "Sélectionnez la date et l'heure de votre session",
    },
    {
      id: 2,
      title: "Groupe",
      description: "Taille du groupe et durée",
      icon: <Users className="h-5 w-5" />,
      completed: currentStep > 2,
      current: currentStep === 2,
      tooltip: "Indiquez le nombre de participants et la durée souhaitée",
    },
    {
      id: 3,
      title: "Paiement",
      description: "Informations complémentaires",
      icon: <CreditCard className="h-5 w-5" />,
      completed: currentStep > 3,
      current: currentStep === 3,
      tooltip: "Finalisez votre réservation et procédez au paiement",
    },
  ];

  const handlePromoCode = (code: string) => {
    form.setValue("promoCode", code);
  };

  const handleAvailabilityChange = (date: Date | undefined, hours: number) => {
    setSelectedDate(date);
    setAvailableHours(hours);
  };

  const handleGroupSizeChange = (size: string) => {
    setGroupSize(size);
    form.setValue("groupSize", size);
  };

  const handleDurationChange = (dur: string) => {
    setDuration(dur);
    form.setValue("duration", dur);
  };

  // Afficher des guides contextuels en fonction de l'étape
  useEffect(() => {
    if (!user) return;

    switch (currentStep) {
      case 1:
        toast({
          title: "📅 Choisissez une date",
          description: "Sélectionnez la date et l'heure qui vous conviennent",
        });
        break;
      case 2:
        toast({
          title: "👥 Taille du groupe",
          description: "Indiquez le nombre de participants et la durée",
        });
        break;
      case 3:
        toast({
          title: "💳 Finalisation",
          description: "Vérifiez les détails et procédez au paiement",
        });
        break;
    }
  }, [currentStep, user]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 animate-fadeIn p-6">
        <BookingSteps steps={steps} currentStep={currentStep} />

        {currentStep === 1 && (
          <DateTimeFields
            form={form}
            onAvailabilityChange={handleAvailabilityChange}
          />
        )}

        {currentStep === 2 && (
          <GroupSizeAndDurationFields
            form={form}
            onGroupSizeChange={handleGroupSizeChange}
            onDurationChange={handleDurationChange}
            onPriceCalculated={setCalculatedPrice}
            availableHours={availableHours}
          />
        )}

        {currentStep === 3 && (
          <AdditionalFields
            form={form}
            calculatedPrice={calculatedPrice}
            groupSize={groupSize}
            duration={duration}
          />
        )}

        <BookingFormActions
          currentStep={currentStep}
          isSubmitting={isSubmitting}
          onPrevious={() => setCurrentStep(currentStep - 1)}
        />
      </form>

      <PromoCodePopup onApplyCode={handlePromoCode} currentStep={currentStep} />
    </Form>
  );
};
