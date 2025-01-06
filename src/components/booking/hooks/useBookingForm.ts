import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useBookingSubmit } from "./useBookingSubmit";

interface UseBookingFormProps {
  form: UseFormReturn<any>;
  groupSize: string;
  duration: string;
  calculatedPrice: number;
}

export const useBookingForm = ({
  form,
  groupSize,
  duration,
  calculatedPrice,
}: UseBookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit: submitBooking } = useBookingSubmit(
    form,
    groupSize,
    duration,
    calculatedPrice,
    setIsSubmitting
  );

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await submitBooking(data);
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    onSubmit,
  };
};