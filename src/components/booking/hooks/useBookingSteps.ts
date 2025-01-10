import React from "react";
import { Step } from "../../BookingSteps";
import { User2, Calendar, Clock, Users, CreditCard } from "lucide-react";
import { useUserState } from "@/hooks/useUserState";

export const useBookingSteps = (currentStep: number): Step[] => {
  const { user } = useUserState();

  // Si l'utilisateur est connecté, on ne montre pas l'étape des coordonnées
  const steps = user ? [
    {
      id: 2,
      title: "Date",
      description: "Choisissez la date",
      icon: React.createElement(Calendar, { className: "h-5 w-5" }),
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      title: "Heure",
      description: "Choisissez l'heure",
      icon: React.createElement(Clock, { className: "h-5 w-5" }),
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      title: "Groupe",
      description: "Taille du groupe",
      icon: React.createElement(Users, { className: "h-5 w-5" }),
      completed: currentStep > 4,
      current: currentStep === 4,
    },
    {
      id: 5,
      title: "Paiement",
      description: "Finalisation",
      icon: React.createElement(CreditCard, { className: "h-5 w-5" }),
      completed: currentStep > 5,
      current: currentStep === 5,
    },
  ] : [
    {
      id: 1,
      title: "Contact",
      description: "Vos coordonnées",
      icon: React.createElement(User2, { className: "h-5 w-5" }),
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      title: "Date",
      description: "Choisissez la date",
      icon: React.createElement(Calendar, { className: "h-5 w-5" }),
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      title: "Heure",
      description: "Choisissez l'heure",
      icon: React.createElement(Clock, { className: "h-5 w-5" }),
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      title: "Groupe",
      description: "Taille du groupe",
      icon: React.createElement(Users, { className: "h-5 w-5" }),
      completed: currentStep > 4,
      current: currentStep === 4,
    },
    {
      id: 5,
      title: "Paiement",
      description: "Finalisation",
      icon: React.createElement(CreditCard, { className: "h-5 w-5" }),
      completed: currentStep > 5,
      current: currentStep === 5,
    },
  ];

  return steps;
};