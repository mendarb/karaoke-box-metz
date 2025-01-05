import { useState } from "react";
import { useForm } from "react-hook-form";
import { BookingFormValues } from "../types/bookingFormTypes";

export const useBookingForm = () => {
  const [groupSize, setGroupSize] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableHours, setAvailableHours] = useState<number>(0);

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
      promoCode: "",
    },
  });

  const handlePriceCalculated = (price: number) => {
    setCalculatedPrice(price);
  };

  const handleAvailabilityChange = (date: Date | undefined, hours: number) => {
    setAvailableHours(hours);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
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