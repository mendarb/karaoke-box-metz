import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { useEffect } from "react";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface ProfileFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading: boolean;
}

export const ProfileForm = ({ initialData, onSubmit, isLoading }: ProfileFormProps) => {
  const form = useForm<ProfileFormData>();

  // Mettre à jour le formulaire quand initialData change
  useEffect(() => {
    if (initialData) {
      console.log("Setting form values with:", initialData);
      form.setValue("first_name", initialData.first_name || "");
      form.setValue("last_name", initialData.last_name || "");
      form.setValue("email", initialData.email || "");
      form.setValue("phone", initialData.phone || "");
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} disabled className="pr-10 bg-gray-50" />
                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </FormControl>
              <FormDescription className="text-sm text-muted-foreground">
                Pour modifier votre email, utilisez l'onglet "Sécurité"
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mise à jour...
            </>
          ) : (
            "Mettre à jour"
          )}
        </Button>
      </form>
    </Form>
  );
};