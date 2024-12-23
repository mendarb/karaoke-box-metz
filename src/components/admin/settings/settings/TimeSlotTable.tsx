import { UseFormReturn } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface TimeSlotTableProps {
  form: UseFormReturn<any>;
}

export const TimeSlotTable = ({ form }: TimeSlotTableProps) => {
  const [newSlot, setNewSlot] = useState("");
  const days = [
    { id: 1, name: "Lundi" },
    { id: 2, name: "Mardi" },
    { id: 3, name: "Mercredi" },
    { id: 4, name: "Jeudi" },
    { id: 5, name: "Vendredi" },
    { id: 6, name: "Samedi" },
    { id: 7, name: "Dimanche" },
  ];

  const handleAddSlot = (dayId: number) => {
    if (!newSlot) return;

    const currentSlots = form.watch(`openingHours.${dayId}.slots`) || [];
    if (!currentSlots.includes(newSlot)) {
      const sortedSlots = [...currentSlots, newSlot].sort();
      form.setValue(`openingHours.${dayId}.slots`, sortedSlots);
    }
  };

  const handleRemoveSlot = (dayId: number, slot: string) => {
    const currentSlots = form.watch(`openingHours.${dayId}.slots`) || [];
    form.setValue(
      `openingHours.${dayId}.slots`,
      currentSlots.filter((s: string) => s !== slot)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nouveau créneau (ex: 17:00)"
          value={newSlot}
          onChange={(e) => setNewSlot(e.target.value)}
          className="w-40"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jour</TableHead>
            <TableHead>Ouvert</TableHead>
            <TableHead>Créneaux</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {days.map((day) => (
            <TableRow key={day.id}>
              <TableCell>{day.name}</TableCell>
              <TableCell>
                <Switch
                  checked={form.watch(`openingHours.${day.id}.isOpen`)}
                  onCheckedChange={(checked) =>
                    form.setValue(`openingHours.${day.id}.isOpen`, checked)
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {form.watch(`openingHours.${day.id}.slots`)?.map((slot: string) => (
                    <div
                      key={slot}
                      className="flex items-center gap-1 bg-violet-100 px-2 py-1 rounded"
                    >
                      <span>{slot}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => handleRemoveSlot(day.id, slot)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {form.watch(`openingHours.${day.id}.isOpen`) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleAddSlot(day.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};