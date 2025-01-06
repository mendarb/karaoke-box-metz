import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { BookingSteps, Step } from "@/components/BookingSteps";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { DateTimeFields } from "./DateTimeFields";
import { GroupSizeAndDurationFields } from "./GroupSizeAndDurationFields";
import { AdditionalFields } from "./AdditionalFields";
import { BookingFormActions } from "./BookingFormActions";
import { useBookingForm } from "./hooks/useBookingForm";
import { User2, Calendar, Users, CreditCard } from "lucide-react";
import { PromoCodePopup } from "./PromoCodePopup";

export const BookingFormWrapper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableHours, setAvailableHours] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const form = useForm({
    defaultValues: {
      email: "",
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

  const { isSubmitting, handleSubmit } = useBookingForm(form);

  const steps: Step[] = [
    {
      id: 1,
      title: "Coordonnées",
      icon: <User2 className="h-5 w-5" />,
      completed: currentStep > 1,
      current: currentStep === 1,
      tooltip: "Renseignez vos informations de contact",
    },
    {
      id: 2,
      title: "Date & Heure",
      icon: <Calendar className="h-5 w-5" />,
      completed: currentStep > 2,
      current: currentStep === 2,
      tooltip: "Choisissez votre créneau de réservation",
    },
    {
      id: 3,
      title: "Groupe",
      icon: <Users className="h-5 w-5" />,
      completed: currentStep > 3,
      current: currentStep === 3,
      tooltip: "Indiquez la taille de votre groupe et la durée",
    },
    {
      id: 4,
      title: "Paiement",
      icon: <CreditCard className="h-5 w-5" />,
      completed: currentStep > 4,
      current: currentStep === 4,
      tooltip: "Finalisez votre réservation",
    },
  ];

  const handlePromoCode = (code: string) => {
    form.setValue("promoCode", code);
    // Trigger validation if needed
  };

  return (
    <Form {...form}>
      <div className="space-y-6 animate-fadeIn p-6">
        <BookingSteps steps={steps} currentStep={currentStep} />

        {currentStep === 1 && (
          <PersonalInfoFields
            form={form}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <DateTimeFields
            form={form}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
            onDateSelect={setSelectedDate}
            onAvailabilityChange={setAvailableHours}
          />
        )}

        {currentStep === 3 && (
          <GroupSizeAndDurationFields
            form={form}
            onBack={() => setCurrentStep(2)}
            onNext={() => setCurrentStep(4)}
            onGroupSizeChange={() => {}}
            onDurationChange={() => {}}
            onPriceCalculated={setCalculatedPrice}
            availableHours={availableHours}
          />
        )}

        {currentStep === 4 && (
          <AdditionalFields
            form={form}
            calculatedPrice={calculatedPrice}
            groupSize={form.getValues("groupSize")}
            duration={form.getValues("duration")}
          />
        )}

        {currentStep === 4 && (
          <BookingFormActions
            form={form}
            isSubmitting={isSubmitting}
            onBack={() => setCurrentStep(3)}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      <PromoCodePopup onApplyCode={handlePromoCode} />
    </Form>
  );
};