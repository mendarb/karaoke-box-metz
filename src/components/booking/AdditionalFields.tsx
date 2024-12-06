import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface AdditionalFieldsProps {
  form: UseFormReturn<any>;
  calculatedPrice: number;
  groupSize: string;
  duration: string;
}

export const AdditionalFields = ({ 
  form, 
  calculatedPrice, 
  groupSize, 
  duration 
}: AdditionalFieldsProps) => {
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCreateAccount(false);
      }
    };
    checkSession();
  }, []);

  const handleCreateAccountChange = async (checked: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      toast({
        title: "Vous êtes déjà connecté",
        description: "Pas besoin de créer un compte",
      });
      setCreateAccount(false);
      return;
    }

    setCreateAccount(checked);
    if (checked) {
      form.setValue('createAccount', true);
      form.setValue('password', password);
    } else {
      form.setValue('createAccount', false);
      form.setValue('password', '');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-violet-50 p-4 rounded-lg space-y-2">
        <h3 className="font-semibold text-violet-900">Récapitulatif de votre réservation</h3>
        <div className="text-sm text-violet-700">
          <p>Nombre de personnes : {groupSize}</p>
          <p>Durée : {duration} heure{parseInt(duration) > 1 ? 's' : ''}</p>
          <p className="font-semibold">Prix total : {calculatedPrice}€</p>
        </div>
      </div>

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Message (optionnel)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Informations complémentaires pour votre réservation..." 
                className="resize-none" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {!supabase.auth.getSession() && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="createAccount"
              checked={createAccount}
              onCheckedChange={handleCreateAccountChange}
            />
            <label
              htmlFor="createAccount"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Créer un compte avec mes informations pour gérer mes réservations
            </label>
          </div>

          {createAccount && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-sm text-gray-600">
                Un compte sera créé avec votre email : {form.getValues("email")}
              </p>
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      form.setValue('password', e.target.value);
                    }}
                    placeholder="Choisissez un mot de passe"
                    className="pr-10"
                    minLength={6}
                    required={createAccount}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-violet-600 hover:text-violet-700"
                >
                  {showPassword ? "Masquer" : "Afficher"} le mot de passe
                </button>
              </FormItem>
            </div>
          )}
        </div>
      )}
    </div>
  );
};