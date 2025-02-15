import React from "react";
import { Step } from "../../BookingSteps";
import { User2, Calendar, Users, CreditCard, Home } from "lucide-react";
import { useUserState } from "@/hooks/useUserState";

export const useBookingSteps = (currentStep: number): Step[] => {
  const { user } = useUserState();

  return [
    {
      id: 1,
      title: "Box",
      description: "Choisissez votre box",
      icon: React.createElement(Home, { className: "h-5 w-5" }),
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      title: "Date & Heure",
      description: "Choisissez votre créneau",
      icon: React.createElement(Calendar, { className: "h-5 w-5" }),
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      title: "Groupe",
      description: "Taille du groupe et durée",
      icon: React.createElement(Users, { className: "h-5 w-5" }),
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      title: "Paiement",
      description: "Informations complémentaires",
      icon: React.createElement(CreditCard, { className: "h-5 w-5" }),
      completed: currentStep > 4,
      current: currentStep === 4,
    },
  ];
};