import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBookingSubmit } from "./useBookingSubmit";
import { useToast } from "@/hooks/use-toast";
import { BookingFormData } from "../types/bookingFormTypes";
import { useUserState } from "@/hooks/useUserState";

export const useBookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [groupSize, setGroupSize] = useState("");
  const [duration, setDuration] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [availableHours, setAvailableHours] = useState(0);
  const { toast } = useToast();
  const { user } = useUserState();

  const form = useForm<BookingFormData>({
    defaultValues: {
      email: user?.email || "",
      fullName: user?.user_metadata?.full_name || "",
      phone: user?.user_metadata?.phone || "",
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

  const validateStep = (data: BookingFormData): boolean => {
    if (currentStep === 1) {
      if (!data.date || !data.timeSlot) {
        toast({
          title: "Champs requis",
          description: "Veuillez sélectionner une date et un créneau horaire",
          variant: "destructive",
        });
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!data.groupSize || !data.duration) {
        toast({
          title: "Champs requis",
          description: "Veuillez sélectionner la taille du groupe et la durée",
          variant: "destructive",
        });
        return false;
      }
    }

    if (currentStep === 3) {
      if (!data.email || !data.fullName || !data.phone) {
        toast({
          title: "Champs requis",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const onSubmit = async (data: BookingFormData) => {
    console.log("Étape actuelle:", currentStep);
    
    if (!validateStep(data)) {
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Final submission
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