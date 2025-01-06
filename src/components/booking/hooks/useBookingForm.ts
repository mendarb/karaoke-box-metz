import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBookingSubmit } from "./useBookingSubmit";
import { useToast } from "@/hooks/use-toast";

export interface BookingFormData {
  email: string;
  fullName: string;
  phone: string;
  date: Date | undefined;
  timeSlot: string;
  duration: string;
  groupSize: string;
  message: string;
  promoCode?: string;
  promoCodeId?: string | null;
  finalPrice: number;
}

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

  const { handleSubmit: submitBooking } = useBookingSubmit(
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
    if (!calculatedPrice || calculatedPrice <= 0) {
      toast({
        title: "Erreur de prix",
        description: "Le prix n'est pas valide. Veuillez recommencer la réservation.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await submitBooking(data);
    } catch (error: any) {
      toast({
        title: "Erreur lors de la réservation",
        description: error.message || "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
    handlePriceCalculated,
    handleAvailabilityChange,
    handlePrevious,
    availableHours,
    onSubmit,
  };
};