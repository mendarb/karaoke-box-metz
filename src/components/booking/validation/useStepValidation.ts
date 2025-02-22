import { BookingFormValues } from "../types/bookingFormTypes";
import { UseFormReturn } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

export const useStepValidation = (form: UseFormReturn<BookingFormValues>) => {
  const validateStep = (step: number) => {
    const requiredFields: { [key: number]: Array<keyof BookingFormValues> } = {
      1: ['location'],
      2: ['date', 'timeSlot'],
      3: ['groupSize', 'duration'],
      4: []
    };

    const fields = requiredFields[step];
    if (!fields) return true;

    let isValid = true;
    const errors: string[] = [];

    fields.forEach(field => {
      const value = form.getValues(field);
      if (!value) {
        form.setError(field, {
          type: 'required',
          message: 'Ce champ est requis'
        });
        isValid = false;
        errors.push(field);
      }
    });

    if (!isValid) {
      console.log('Validation errors:', errors);
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
    }

    return isValid;
  };

  return { validateStep };
};