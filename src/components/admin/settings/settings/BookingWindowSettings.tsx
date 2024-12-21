import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingWindowSettingsProps {
  form: UseFormReturn<any>;
  defaultValue?: {
    startDays: number;
    endDays: number;
  };
}

export const BookingWindowSettings = ({ form, defaultValue }: BookingWindowSettingsProps) => {
  const isTestMode = form.watch("isTestMode");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-violet-500" />
          Fenêtre de réservation
        </CardTitle>
        <CardDescription>
          Configurez les délais de réservation et le mode test
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bookingWindow.startDays"
            defaultValue={defaultValue?.startDays}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Délai minimum (jours)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </FormControl>
                <FormDescription>
                  Nombre de jours minimum avant une réservation
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookingWindow.endDays"
            defaultValue={defaultValue?.endDays}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Délai maximum (jours)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </FormControl>
                <FormDescription>
                  Nombre de jours maximum pour réserver à l'avance
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};