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
import { AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface BookingWindowSettingsProps {
  form: UseFormReturn<any>;
}

export const BookingWindowSettings = ({ form }: BookingWindowSettingsProps) => {
  const isTestMode = form.watch("isTestMode");

  return (
    <div className="space-y-6">
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
          name="bookingWindow.startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de début des réservations</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || (form.watch("bookingWindow.endDate") && date > form.watch("bookingWindow.endDate"))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Date à partir de laquelle les clients peuvent réserver
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bookingWindow.endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de fin des réservations</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || (form.watch("bookingWindow.startDate") && date < form.watch("bookingWindow.startDate"))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Date jusqu'à laquelle les clients peuvent réserver
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};