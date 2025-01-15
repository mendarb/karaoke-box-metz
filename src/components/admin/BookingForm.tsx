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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type PaymentMethod = 'stripe' | 'sumup' | 'cash';

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

  const durations = ["1", "2", "3", "4"];
  const groupSizes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];

  const handlePriceCalculated = (price: number) => {
    form.setValue("calculatedPrice", price);
  };

  const onSubmit = async () => {
    const data = form.getValues();
    
    // Convert string date to Date object
    const bookingDate = data.date ? new Date(data.date) : null;
    
    if (!bookingDate) {
      console.error('Invalid date');
      return;
    }
    
    // Vérifier les chevauchements
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
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Type de client</h3>
              <RadioGroup
                defaultValue="existing"
                onValueChange={(value) => setClientType(value as 'existing' | 'new')}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="existing" id="existing" className="peer sr-only" />
                  <Label
                    htmlFor="existing"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600"
                  >
                    <span>Client existant</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="new" id="new" className="peer sr-only" />
                  <Label
                    htmlFor="new"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600"
                  >
                    <span>Nouveau client</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

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
            durations={durations}
            groupSizes={groupSizes}
            isLoading={isLoading}
            onPriceCalculated={handlePriceCalculated}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Méthode de paiement</h3>
              <RadioGroup
                defaultValue="stripe"
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="stripe" id="stripe" className="peer sr-only" />
                  <Label
                    htmlFor="stripe"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600"
                  >
                    <span>Stripe (en ligne)</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="sumup" id="sumup" className="peer sr-only" />
                  <Label
                    htmlFor="sumup"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600"
                  >
                    <span>SumUp (carte)</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                  <Label
                    htmlFor="cash"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-violet-600 [&:has([data-state=checked])]:border-violet-600"
                  >
                    <span>Espèces</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

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