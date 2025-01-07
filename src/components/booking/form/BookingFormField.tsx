import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface BookingFormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  children: React.ReactNode;
  autoComplete?: string;
}

export const BookingFormField = ({ 
  form, 
  name, 
  label, 
  children,
  autoComplete 
}: BookingFormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {React.cloneElement(children as React.ReactElement, {
              ...field,
              autoComplete,
              id: name
            })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};