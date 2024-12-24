import { UseFormReturn } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface TimeSlotTableProps {
  form: UseFormReturn<any>;
}

export const TimeSlotTable = ({ form }: TimeSlotTableProps) => {
  const [newSlot, setNewSlot] = useState("");
  const days = [
    { id: "1", name: "Lundi" },
    { id: "2", name: "Mardi" },
    { id: "3", name: "Mercredi" },
    { id: "4", name: "Jeudi" },
    { id: "5", name: "Vendredi" },
    { id: "6", name: "Samedi" },
    { id: "7", name: "Dimanche" },
  ];

  const validateTimeSlot = (slot: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(slot)) {
      toast({
        title: "Format invalide",
        description: "Le format doit être HH:MM (ex: 17:00)",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleAddSlot = (dayId: string) => {
    if (!newSlot || !validateTimeSlot(newSlot)) return;

    const currentSlots = form.watch(`openingHours.${dayId}.slots`) || [];
    if (!currentSlots.includes(newSlot)) {
      const sortedSlots = [...currentSlots, newSlot].sort((a, b) => {
        const timeA = a.split(':').map(Number);
        const timeB = b.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
      form.setValue(`openingHours.${dayId}.slots`, sortedSlots);
      console.log(`✅ Créneau ajouté pour ${dayId}:`, sortedSlots);
    } else {
      toast({
        title: "Créneau existant",
        description: "Ce créneau existe déjà pour ce jour",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSlot = (dayId: string, slot: string) => {
    const currentSlots = form.watch(`openingHours.${dayId}.slots`) || [];
    const updatedSlots = currentSlots.filter((s: string) => s !== slot);
    form.setValue(`openingHours.${dayId}.slots`, updatedSlots);
    console.log(`❌ Créneau supprimé pour ${dayId}:`, slot);
  };

  const handleDayToggle = (dayId: string, isOpen: boolean) => {
    form.setValue(`openingHours.${dayId}.isOpen`, isOpen);
    console.log(`🔄 Jour ${dayId} ${isOpen ? 'ouvert' : 'fermé'}`);
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
            <TableHead className="w-32">Jour</TableHead>
            <TableHead className="w-24">Ouvert</TableHead>
            <TableHead>Créneaux</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {days.map((day) => (
            <TableRow key={day.id}>
              <TableCell className="font-medium">{day.name}</TableCell>
              <TableCell>
                <Switch
                  checked={form.watch(`openingHours.${day.id}.isOpen`)}
                  onCheckedChange={(checked) => handleDayToggle(day.id, checked)}
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
                        className="h-4 w-4 hover:bg-violet-200"
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