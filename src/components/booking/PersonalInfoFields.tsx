import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<any>;
}

export const PersonalInfoFields = ({ form }: PersonalInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        rules={{ required: "Le nom est requis" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom complet *</FormLabel>
            <FormControl>
              <Input placeholder="Entrez votre nom complet" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        rules={{ 
          required: "L'email est requis",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Email invalide"
          }
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse e-mail *</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Entrez votre adresse e-mail" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        rules={{ 
          required: "Le numéro de téléphone est requis",
          pattern: {
            value: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
            message: "Numéro de téléphone invalide"
          }
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de téléphone *</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="Indiquez votre numéro de contact" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};