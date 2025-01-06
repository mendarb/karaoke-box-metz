import { useState } from "react";
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

export const BookingFormWrapper = () => {
  const { user } = useUserState();
  const [currentStep, setCurrentStep] = useState(1);
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

  const { isSubmitting } = useBookingForm();

  const steps: Step[] = [
    {
      id: 1,
      title: "Date & Heure",
      description: "Choisissez votre créneau",
      icon: <Calendar className="h-5 w-5" />,
      completed: currentStep > 1,
      current: currentStep === 1,
      tooltip: "Choisissez votre créneau de réservation",
    },
    {
      id: 2,
      title: "Groupe",
      description: "Taille du groupe et durée",
      icon: <Users className="h-5 w-5" />,
      completed: currentStep > 2,
      current: currentStep === 2,
      tooltip: "Indiquez la taille de votre groupe et la durée",
    },
    {
      id: 3,
      title: "Paiement",
      description: "Informations complémentaires",
      icon: <CreditCard className="h-5 w-5" />,
      completed: currentStep > 3,
      current: currentStep === 3,
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

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Retour
            </button>
          )}
          {currentStep < 3 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
            >
              Suivant
            </button>
          )}
          {currentStep === 3 && (
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