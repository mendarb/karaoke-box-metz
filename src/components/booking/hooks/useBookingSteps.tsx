import { Calendar, Users, CreditCard } from "lucide-react";
import { Step } from "@/components/BookingSteps";

export const useBookingSteps = (currentStep: number) => {
  const getSteps = (): Step[] => {
    return [
      {
        title: "Date & Heure",
        description: "Choisissez votre créneau",
        icon: <Calendar className="h-5 w-5" />,
        completed: currentStep > 1,
        current: currentStep === 1,
      },
      {
        title: "Groupe & Durée",
        description: "Nombre de personnes et durée",
        icon: <Users className="h-5 w-5" />,
        completed: currentStep > 2,
        current: currentStep === 2,
      },
      {
        title: "Confirmation",
        description: "Vérification et paiement",
        icon: <CreditCard className="h-5 w-5" />,
        completed: currentStep > 3,
        current: currentStep === 3,
      },
    ];
  };

  return getSteps();
};