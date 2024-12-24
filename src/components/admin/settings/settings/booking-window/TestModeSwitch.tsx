import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TestModeSwitchProps {
  form: UseFormReturn<any>;
}

export const TestModeSwitch = ({ form }: TestModeSwitchProps) => {
  const isTestMode = form.watch("isTestMode");

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="isTestMode"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Mode Test</FormLabel>
              <FormDescription>
                Activer le mode test pour Stripe (cartes de test uniquement)
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {isTestMode && (
        <Alert variant="warning" className="bg-yellow-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Mode test activé - Les paiements utiliseront la clé API Stripe de test
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};