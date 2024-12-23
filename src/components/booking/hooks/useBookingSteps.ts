import React from "react";
import { Step } from "../../BookingSteps";
import { User2, Calendar, Users, CreditCard } from "lucide-react";

export const useBookingSteps = (currentStep: number): Step[] => {
  return [
    {
      id: 1,
      title: "Coordonnées",
      description: "Vos coordonnées",
      icon: React.createElement(User2, { className: "h-5 w-5" }),
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