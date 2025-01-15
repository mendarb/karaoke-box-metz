import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useAdminBookingSubmit } from "./booking-form/hooks/useAdminBookingSubmit";
import { useBookingOverlap } from "@/hooks/useBookingOverlap";
import { ClientSelection } from "./booking-form/steps/ClientSelection";
import { BookingDetails } from "./booking-form/steps/BookingDetails";
import { Confirmation } from "./booking-form/steps/Confirmation";
import { BookingSteps } from "@/components/BookingSteps";
import { useState } from "react";
import { User2, Calendar, Users } from "lucide-react";
import type { Step } from "@/components/BookingSteps";
import { ClientTypeSelector } from "./booking-form/ClientTypeSelector";
import { PaymentMethodSelector } from "./booking-form/PaymentMethodSelector";

export type PaymentMethod = 'stripe' | 'sumup' | 'cash';

export const AdminBookingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientType, setClientType] = useState<'existing' | 'new'>('existing');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  
  const form = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      date: "",
      timeSlot: "",
      duration: "1",
      groupSize: "1",
      message: "",
      calculatedPrice: 0,
      userId: null,
      paymentMethod: "stripe" as PaymentMethod,
    },
  });

  const { checkOverlap } = useBookingOverlap();
  const { isLoading, paymentLink, handleSubmit } = useAdminBookingSubmit(form);

  const handlePriceCalculated = (price: number) => {
    form.setValue("calculatedPrice", price);
  };

  const onSubmit = async () => {
    const data = form.getValues();
    const bookingDate = data.date ? new Date(data.date) : null;
    
    if (!bookingDate) {
      console.error('Invalid date');
      return;
    }
    
    const hasOverlap = await checkOverlap(bookingDate, data.timeSlot, data.duration);
    if (hasOverlap) return;

    await handleSubmit({ ...data, paymentMethod });
  };

  const steps: Step[] = [
    {
      id: 1,
      title: "Client",
      description: "Sélection du client",
      icon: React.createElement(User2, { className: "h-5 w-5" }),
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      title: "Détails",
      description: "Date et informations",
      icon: React.createElement(Calendar, { className: "h-5 w-5" }),
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      title: "Confirmation",
      description: "Validation",
      icon: React.createElement(Users, { className: "h-5 w-5" }),
      completed: currentStep > 3,
      current: currentStep === 3,
    },
  ];

  return (
    <Form {...form}>
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <BookingSteps steps={steps} currentStep={currentStep} />

        {currentStep === 1 && (
          <div className="space-y-6">
            <ClientTypeSelector 
              value={clientType}
              onChange={setClientType}
            />
            <ClientSelection
              form={form}
              onNext={() => setCurrentStep(2)}
              clientType={clientType}
            />
          </div>
        )}

        {currentStep === 2 && (
          <BookingDetails
            form={form}
            durations={["1", "2", "3", "4"]}
            groupSizes={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]}
            isLoading={isLoading}
            onPriceCalculated={handlePriceCalculated}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
            />
            <Confirmation
              form={form}
              isLoading={isLoading}
              paymentLink={paymentLink}
              onBack={() => setCurrentStep(2)}
              onSubmit={onSubmit}
              paymentMethod={paymentMethod}
            />
          </div>
        )}
      </div>
    </Form>
  );
};