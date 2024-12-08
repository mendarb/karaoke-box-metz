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
import { Plus, Minus } from "lucide-react";

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
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Horaires d'ouverture</h3>
      
      {DAYS.map((day) => (
        <div key={day.id} className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <FormLabel>{day.name}</FormLabel>
            <FormField
              control={form.control}
              name={`openingHours.${day.id}.isOpen`}
              defaultValue={defaultValue?.[day.id]?.isOpen}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
        </div>
      ))}
    </div>
  );
};