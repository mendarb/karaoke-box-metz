import { User2, Calendar, Users, CreditCard } from "lucide-react";
import { Step } from "@/components/BookingSteps";
import { useUserState } from "@/hooks/useUserState";

export const useBookingSteps = (currentStep: number) => {
  const { user } = useUserState();

  const getSteps = (): Step[] => {
    if (user) {
      // Skip coordinates step for logged-in users
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
    }

    return [
      {
        title: "Coordonnées",
        description: "Informations de contact",
        icon: <User2 className="h-5 w-5" />,
        completed: currentStep > 1,
        current: currentStep === 1,
      },
      {
        title: "Date & Heure",
        description: "Choisissez votre créneau",
        icon: <Calendar className="h-5 w-5" />,
        completed: currentStep > 2,
        current: currentStep === 2,
      },
      {
        title: "Groupe & Durée",
        description: "Nombre de personnes et durée",
        icon: <Users className="h-5 w-5" />,
        completed: currentStep > 3,
        current: currentStep === 3,
      },
      {
        title: "Confirmation",
        description: "Vérification et paiement",
        icon: <CreditCard className="h-5 w-5" />,
        completed: currentStep > 4,
        current: currentStep === 4,
      },
    ];
  };

  return getSteps();
};