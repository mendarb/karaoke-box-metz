import { BookingStep } from "../../BookingSteps";

export const useBookingSteps = (currentStep: number, isAuthenticated: boolean): BookingStep[] => {
  const steps = [
    {
      id: 1,
      name: "Informations personnelles",
      description: "Vos coordonnées",
      completed: currentStep > 1 || isAuthenticated,
      current: currentStep === 1 && !isAuthenticated,
    },
    {
      id: 2,
      name: "Cabine",
      description: "Choisissez votre cabine",
      completed: currentStep > 2,
      current: (currentStep === 2) || (currentStep === 1 && isAuthenticated),
    },
    {
      id: 3,
      name: "Date et heure",
      description: "Choisissez votre créneau",
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      name: "Groupe et durée",
      description: "Taille du groupe et durée",
      completed: currentStep > 4,
      current: currentStep === 4,
    },
    {
      id: 5,
      name: "Finalisation",
      description: "Informations complémentaires",
      completed: currentStep > 5,
      current: currentStep === 5,
    },
  ];

  return steps;
};