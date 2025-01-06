import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBookingSubmit } from "./useBookingSubmit";
import { useToast } from "@/hooks/use-toast";
import { BookingFormData } from "../types/bookingFormTypes";

export const useBookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [groupSize, setGroupSize] = useState("");
  const [duration, setDuration] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [availableHours, setAvailableHours] = useState(0);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      date: undefined,
      timeSlot: "",
      duration: "",
      groupSize: "",
      message: "",
      promoCode: "",
      promoCodeId: null,
      finalPrice: 0,
    },
  });

  const { handleSubmit } = useBookingSubmit(
    form,
    groupSize,
    duration,
    calculatedPrice,
    setIsSubmitting
  );

  const handlePriceCalculated = (price: number) => {
    if (price <= 0) {
      toast({
        title: "Erreur de prix",
        description: "Le prix calculé est invalide. Veuillez réessayer.",
        variant: "destructive",
      });
      return;
    }
    setCalculatedPrice(price);
    form.setValue("finalPrice", price);
  };

  const handleAvailabilityChange = (date: Date | undefined, hours: number) => {
    setAvailableHours(hours);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (data: BookingFormData) => {
    console.log("Étape actuelle:", currentStep);
    
    if (currentStep < 3) {
      // Validation par étape
      if (currentStep === 1 && (!data.date || !data.timeSlot)) {
        toast({
          title: "Champs requis",
          description: "Veuillez sélectionner une date et un créneau horaire",
          variant: "destructive",
        });
        return;
      }
      
      if (currentStep === 2 && (!data.groupSize || !data.duration)) {
        toast({
          title: "Champs requis",
          description: "Veuillez sélectionner la taille du groupe et la durée",
          variant: "destructive",
        });
        return;
      }

      // Si la validation passe, on passe à l'étape suivante
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Dernière étape - soumission finale
    try {
      await handleSubmit(data);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    groupSize,
    setGroupSize,
    duration,
    setDuration,
    currentStep,
    setCurrentStep,
    calculatedPrice,
    isSubmitting,
    handlePriceCalculated,
    handleAvailabilityChange,
    handlePrevious,
    availableHours,
    onSubmit: form.handleSubmit(onSubmit),
  };
};