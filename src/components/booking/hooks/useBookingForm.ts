import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { BookingFormValues } from "../types/bookingFormTypes";

export const useBookingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [groupSize, setGroupSize] = useState("");
  const [duration, setDuration] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableHours, setAvailableHours] = useState(0);

  const form = useForm<BookingFormValues>({
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      date: undefined,
      timeSlot: "",
      groupSize: "",
      duration: "",
      message: "",
    },
  });

  const handlePriceCalculated = useCallback((price: number) => {
    setCalculatedPrice(price);
  }, []);

  const handleAvailabilityChange = useCallback((date: Date | undefined, hours: number) => {
    setAvailableHours(hours);
  }, []);

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation des étapes
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!form.getValues("date") && !!form.getValues("timeSlot");
      case 2:
        return !!groupSize && !!duration;
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Ne permet pas de passer à l'étape suivante si l'étape actuelle n'est pas validée
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
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
    setIsSubmitting,
    availableHours,
    handlePriceCalculated,
    handleAvailabilityChange,
    handlePrevious,
    handleNextStep,
  };
};