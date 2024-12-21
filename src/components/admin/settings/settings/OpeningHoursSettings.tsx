import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DAYS = [
  { id: 1, name: "Lundi" },
  { id: 2, name: "Mardi" },
  { id: 3, name: "Mercredi" },
  { id: 4, name: "Jeudi" },
  { id: 5, name: "Vendredi" },
  { id: 6, name: "Samedi" },
  { id: 0, name: "Dimanche" },
];

interface OpeningHoursSettingsProps {
  form: UseFormReturn<any>;
  defaultValue?: {
    [key: string]: {
      isOpen: boolean;
      slots: string[];
    };
  };
}

export const OpeningHoursSettings = ({ form, defaultValue }: OpeningHoursSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-violet-500" />
          Horaires d'ouverture
        </CardTitle>
        <CardDescription>
          Configurez les jours et créneaux d'ouverture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Les créneaux doivent être au format 24h (ex: 17:00, 18:00)
          </AlertDescription>
        </Alert>
        
        {DAYS.map((day) => (
          <Card key={day.id} className="border-violet-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <FormLabel className="text-lg font-medium">{day.name}</FormLabel>
                <FormField
                  control={form.control}
                  name={`openingHours.${day.id}.isOpen`}
                  defaultValue={defaultValue?.[day.id]?.isOpen}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <span className="text-sm text-gray-500">
                            {field.value ? "Ouvert" : "Fermé"}
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`openingHours.${day.id}.slots`}
                defaultValue={defaultValue?.[day.id]?.slots || []}
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      {field.value?.map((slot: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={slot}
                            onChange={(e) => {
                              const newSlots = [...field.value];
                              newSlots[index] = e.target.value;
                              field.onChange(newSlots);
                            }}
                            className="w-full"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newSlots = field.value.filter((_: string, i: number) => i !== index);
                              field.onChange(newSlots);
                            }}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          field.onChange([...field.value, "17:00"]);
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un créneau
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};