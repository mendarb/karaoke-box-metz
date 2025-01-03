import { User2, Calendar, Users, CreditCard } from "lucide-react";
import { Step } from "@/components/BookingSteps";

export const useBookingSteps = (currentStep: number): Step[] => {
  return [
    {
      id: 1,
      title: "Vos coordonnées",
      description: "Informations de contact",
      icon: <User2 size={20} />,
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      title: "Date & Heure",
      description: "Choisissez votre créneau",
      icon: <Calendar size={20} />,
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      title: "Groupe & Durée",
      description: "Nombre de personnes et durée",
      icon: <Users size={20} />,
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      title: "Confirmation",
      description: "Vérification et paiement",
      icon: <CreditCard size={20} />,
      completed: currentStep > 4,
      current: currentStep === 4,
    },
  ];
};