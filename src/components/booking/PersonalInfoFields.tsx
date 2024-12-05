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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom complet</FormLabel>
            <FormControl>
              <Input placeholder="Entrez votre nom complet" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse e-mail</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Entrez votre adresse e-mail" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de téléphone</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="Indiquez votre numéro de contact" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};