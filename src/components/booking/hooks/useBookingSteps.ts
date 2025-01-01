import React from "react";
import { User2, Calendar, Users, CreditCard } from "lucide-react";
import { useUserState } from "@/hooks/useUserState";
import { BookingStep } from "../BookingSteps";

export const useBookingSteps = (currentStep: number): BookingStep[] => {
  const { user } = useUserState();

  // Si l'utilisateur est connecté, on ne montre pas l'étape des coordonnées
  const steps = user ? [
    {
      id: 2,
      name: "Date & Heure",
      title: "Date & Heure",
      description: "Choisissez votre créneau",
      icon: React.createElement(Calendar, { className: "h-5 w-5" }),
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      name: "Groupe",
      title: "Groupe",
      description: "Taille du groupe et durée",
      icon: React.createElement(Users, { className: "h-5 w-5" }),
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      name: "Paiement",
      title: "Paiement",
      description: "Informations complémentaires",
      icon: React.createElement(CreditCard, { className: "h-5 w-5" }),
      completed: currentStep > 4,
      current: currentStep === 4,
    },
  ] : [
    {
      id: 1,
      name: "Coordonnées",
      title: "Coordonnées",
      description: "Vos coordonnées",
      icon: React.createElement(User2, { className: "h-5 w-5" }),
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      name: "Date & Heure",
      title: "Date & Heure",
      description: "Choisissez votre créneau",
      icon: React.createElement(Calendar, { className: "h-5 w-5" }),
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      name: "Groupe",
      title: "Groupe",
      description: "Taille du groupe et durée",
      icon: React.createElement(Users, { className: "h-5 w-5" }),
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      name: "Paiement",
      title: "Paiement",
      description: "Informations complémentaires",
      icon: React.createElement(CreditCard, { className: "h-5 w-5" }),
      completed: currentStep > 4,
      current: currentStep === 4,
    },
  ];

  return steps;
};