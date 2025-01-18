import { User2, Calendar, Users, CreditCard, Home } from "lucide-react";
import React from "react";
import { Step } from "@/components/BookingSteps";
import { useUserState } from "./useUserState";

export const useBookingSteps = (currentStep: number): Step[] => {
  const { user } = useUserState();

  const steps = user ? [
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
  ] : [
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
      title: "Coordonnées",
      description: "Vos coordonnées",
      icon: React.createElement(User2, { className: "h-5 w-5" }),
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      title: "Date & Heure",
      description: "Choisissez votre créneau",
      icon: React.createElement(Calendar, { className: "h-5 w-5" }),
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      title: "Groupe",
      description: "Taille du groupe et durée",
      icon: React.createElement(Users, { className: "h-5 w-5" }),
      completed: currentStep > 4,
      current: currentStep === 4,
    },
    {
      id: 5,
      title: "Paiement",
      description: "Informations complémentaires",
      icon: React.createElement(CreditCard, { className: "h-5 w-5" }),
      completed: currentStep > 5,
      current: currentStep === 5,
    },
  ];

  return steps;
};