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
import { AlertCircle, TestTube2 } from "lucide-react";
import { useEffect } from "react";

interface TestModeSwitchProps {
  form: UseFormReturn<any>;
}

export const TestModeSwitch = ({ form }: TestModeSwitchProps) => {
  const isTestMode = form.watch("isTestMode");

  useEffect(() => {
    console.log('🔧 Test mode switch state:', isTestMode);
  }, [isTestMode]);

  return (
    <div className="space-y-4 bg-card p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <TestTube2 className="h-5 w-5 text-violet-500" />
        <h2 className="font-medium">Mode Test</h2>
      </div>

      <FormField
        control={form.control}
        name="isTestMode"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Activer le mode test</FormLabel>
              <FormDescription>
                Pour utiliser les cartes de test Stripe
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  console.log('🔧 Switching test mode to:', checked);
                  field.onChange(checked);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {isTestMode && (
        <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Mode test activé - Les paiements utiliseront la clé API Stripe de test
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};