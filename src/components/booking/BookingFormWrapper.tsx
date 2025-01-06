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
import { useUserState } from "@/hooks/useUserState";

export const BookingFormWrapper = () => {
  const { user } = useUserState();
  const [currentStep, setCurrentStep] = useState(user ? 2 : 1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableHours, setAvailableHours] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [groupSize, setGroupSize] = useState("");
  const [duration, setDuration] = useState("");

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

  return (
    <Form {...form}>
      <div className="space-y-6 animate-fadeIn p-6">
        <BookingSteps steps={steps} currentStep={currentStep} />

        {currentStep === 1 && !user && (
          <PersonalInfoFields
            form={form}
          />
        )}

        {currentStep === 2 && (
          <DateTimeFields
            form={form}
            onAvailabilityChange={handleAvailabilityChange}
          />
        )}

        {currentStep === 3 && (
          <GroupSizeAndDurationFields
            form={form}
            onGroupSizeChange={handleGroupSizeChange}
            onDurationChange={handleDurationChange}
            onPriceCalculated={setCalculatedPrice}
            availableHours={availableHours}
          />
        )}

        {currentStep === 4 && (
          <AdditionalFields
            form={form}
            calculatedPrice={calculatedPrice}
            groupSize={groupSize}
            duration={duration}
          />
        )}

        <div className="flex justify-between mt-6">
          {currentStep > (user ? 2 : 1) && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Retour
            </button>
          )}
          {currentStep < 4 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
            >
              Suivant
            </button>
          )}
          {currentStep === 4 && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50"
            >
              {isSubmitting ? "En cours..." : "Réserver"}
            </button>
          )}
        </div>
      </div>

      <PromoCodePopup onApplyCode={handlePromoCode} />
    </Form>
  );
};