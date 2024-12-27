import { UseFormReturn } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface TimeSlotTableProps {
  form: UseFormReturn<any>;
}

export const TimeSlotTable = ({ form }: TimeSlotTableProps) => {
  const [newSlot, setNewSlot] = useState("");
  const days = [
    { id: "0", name: "Dimanche" },
    { id: "1", name: "Lundi" },
    { id: "2", name: "Mardi" },
    { id: "3", name: "Mercredi" },
    { id: "4", name: "Jeudi" },
    { id: "5", name: "Vendredi" },
    { id: "6", name: "Samedi" },
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
    
    if (currentSlots.includes(newSlot)) {
      toast({
        title: "Créneau existant",
        description: "Ce créneau existe déjà pour ce jour",
        variant: "destructive",
      });
      return;
    }

    const sortedSlots = [...currentSlots, newSlot].sort((a, b) => {
      const timeA = a.split(':').map(Number);
      const timeB = b.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });

    form.setValue(`openingHours.${dayId}.slots`, sortedSlots);
  };

  const handleRemoveSlot = (dayId: string, slot: string) => {
    const currentSlots = form.watch(`openingHours.${dayId}.slots`) || [];
    const updatedSlots = currentSlots.filter((s: string) => s !== slot);
    form.setValue(`openingHours.${dayId}.slots`, updatedSlots);
  };

  const handleDayToggle = (dayId: string, isOpen: boolean) => {
    form.setValue(`openingHours.${dayId}.isOpen`, isOpen);
  };

  const getDefaultSlots = () => {
    return ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  };

  const handleResetDay = (dayId: string) => {
    form.setValue(`openingHours.${dayId}.slots`, getDefaultSlots());
    form.setValue(`openingHours.${dayId}.isOpen`, true);
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

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Jour</TableHead>
              <TableHead className="w-24">Ouvert</TableHead>
              <TableHead>Créneaux</TableHead>
              <TableHead className="w-24">Actions</TableHead>
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
                  <div className="flex flex-wrap gap-1">
                    {form.watch(`openingHours.${day.id}.slots`)?.map((slot: string) => (
                      <Badge
                        key={slot}
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        {slot}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 hover:bg-violet-100 -mr-1"
                          onClick={() => handleRemoveSlot(day.id, slot)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </Badge>
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
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleResetDay(day.id)}
                    className="h-8 w-8"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};