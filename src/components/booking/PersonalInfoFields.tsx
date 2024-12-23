import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import { Mail } from "lucide-react";
import { useUserState } from "@/hooks/useUserState";
import { supabase } from "@/lib/supabase";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<any>;
}

export const PersonalInfoFields = ({ form }: PersonalInfoFieldsProps) => {
  const { user } = useUserState();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          form.setValue('email', user.email || '');
          
          // Récupérer la dernière réservation de l'utilisateur pour pré-remplir les champs
          const { data: lastBooking } = await supabase
            .from('bookings')
            .select('user_name, user_phone')
            .eq('user_id', user.id)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (lastBooking) {
            form.setValue('fullName', lastBooking.user_name);
            form.setValue('phone', lastBooking.user_phone);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [form, user]);

  return (
    <div className="space-y-4 animate-fadeIn">
      <FormField
        control={form.control}
        name="fullName"
        rules={{ required: "Le nom est requis" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom complet *</FormLabel>
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
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="Entrez votre adresse e-mail" 
                  {...field} 
                  disabled={!!user}
                  className="pr-10 bg-gray-50"
                />
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
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
              <Input 
                type="tel" 
                placeholder="Ex: 06 12 34 56 78" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};