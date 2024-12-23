import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ContactInfoSettingsProps {
  form: UseFormReturn<any>;
  defaultValues?: {
    email: string;
    phone: string;
    address: string;
  };
}

export const ContactInfoSettings = ({ form, defaultValues }: ContactInfoSettingsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="contact_info.email"
        defaultValue={defaultValues?.email}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="contact@example.com" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_info.phone"
        defaultValue={defaultValues?.phone}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone</FormLabel>
            <FormControl>
              <Input {...field} type="tel" placeholder="01 23 45 67 89" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_info.address"
        defaultValue={defaultValues?.address}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input {...field} placeholder="1 rue du Karaoké, 57000 Metz" />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};