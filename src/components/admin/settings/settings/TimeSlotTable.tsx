import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";

const DAYS = [
  { id: 1, name: "Lundi" },
  { id: 2, name: "Mardi" },
  { id: 3, name: "Mercredi" },
  { id: 4, name: "Jeudi" },
  { id: 5, name: "Vendredi" },
  { id: 6, name: "Samedi" },
  { id: 0, name: "Dimanche" },
];

const DEFAULT_SLOTS = ["17:00", "18:00", "19:00", "20:00", "21:00"];

interface TimeSlotTableProps {
  form: UseFormReturn<any>;
}

export const TimeSlotTable = ({ form }: TimeSlotTableProps) => {
  const maxSlots = Math.max(
    ...DAYS.map(day => form.watch(`openingHours.${day.id}.slots`)?.length || 0),
    DEFAULT_SLOTS.length
  );

  const handleAddSlot = (dayId: number) => {
    const currentSlots = form.watch(`openingHours.${dayId}.slots`) || [];
    const lastSlot = currentSlots[currentSlots.length - 1] || "16:00";
    const [hours] = lastSlot.split(":");
    const nextHour = (parseInt(hours) + 1).toString().padStart(2, "0");
    form.setValue(`openingHours.${dayId}.slots`, [...currentSlots, `${nextHour}:00`]);
  };

  const handleRemoveSlot = (dayId: number, index: number) => {
    const currentSlots = form.watch(`openingHours.${dayId}.slots`) || [];
    form.setValue(
      `openingHours.${dayId}.slots`,
      currentSlots.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Jour</TableHead>
            <TableHead className="w-[100px]">Ouvert</TableHead>
            <TableHead>Créneaux horaires</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DAYS.map((day) => (
            <TableRow key={day.id}>
              <TableCell className="font-medium">{day.name}</TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`openingHours.${day.id}.isOpen`}
                  render={({ field }) => (
                    <FormItem>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`openingHours.${day.id}.slots`}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {(field.value || []).map((slot: string, index: number) => (
                        <div key={index} className="flex items-center gap-1">
                          <input
                            type="time"
                            value={slot}
                            onChange={(e) => {
                              const newSlots = [...field.value];
                              newSlots[index] = e.target.value;
                              field.onChange(newSlots);
                            }}
                            className="w-24 rounded-md border px-2 py-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSlot(day.id, index)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddSlot(day.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};