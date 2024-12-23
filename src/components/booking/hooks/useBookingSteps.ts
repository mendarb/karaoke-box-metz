import { Step } from "../../BookingSteps";
import { User, Calendar, Users, Settings } from "lucide-react";

export const useBookingSteps = (currentStep: number): Step[] => {
  return [
    {
      id: 1,
      title: "Informations personnelles",
      description: "Vos coordonnées",
      icon: <User className="h-5 w-5" />,
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      title: "Date et heure",
      description: "Choisissez votre créneau",
      icon: <Calendar className="h-5 w-5" />,
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      title: "Groupe et durée",
      description: "Taille du groupe et durée",
      icon: <Users className="h-5 w-5" />,
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      title: "Finalisation",
      description: "Informations complémentaires",
      icon: <Settings className="h-5 w-5" />,
      completed: currentStep > 4,
      current: currentStep === 4,
    },
  ];
};