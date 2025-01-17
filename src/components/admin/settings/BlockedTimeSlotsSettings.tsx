import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface BlockedTimeSlot {
  id: string;
  date: string;
  time_slot: string;
  reason: string | null;
  type: 'one_time' | 'recurring';
  recurring_days: number[] | null;
}

export const BlockedTimeSlotsSettings = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const { toast } = useToast();

  const { data: blockedSlots, isLoading, refetch } = useQuery({
    queryKey: ['blocked-slots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blocked_time_slots')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data as BlockedTimeSlot[];
    },
  });

  const handleAddBlockedSlot = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date et une heure",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('blocked_time_slots')
        .insert([{
          date: format(selectedDate, 'yyyy-MM-dd'),
          time_slot: selectedTime,
          reason: reason || null,
          type: isRecurring ? 'recurring' : 'one_time',
          recurring_days: isRecurring ? [selectedDate.getDay()] : null,
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le créneau a été bloqué",
      });

      refetch();
      setReason("");
      setSelectedTime("");
    } catch (error) {
      console.error('Error blocking slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de bloquer le créneau",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlockedSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blocked_time_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le créneau a été débloqué",
      });

      refetch();
    } catch (error) {
      console.error('Error unblocking slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de débloquer le créneau",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Bloquer des créneaux</h3>
        <p className="text-sm text-muted-foreground">
          Gérez les créneaux indisponibles pour les réservations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="rounded-md border"
          />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Heure</Label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Sélectionner une heure</option>
                {Array.from({ length: 9 }, (_, i) => i + 14).map((hour) => (
                  <option key={hour} value={`${hour}:00`}>
                    {hour}:00
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Raison (optionnel)</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Maintenance"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
              <Label>Bloquer ce créneau chaque semaine</Label>
            </div>

            <Button
              onClick={handleAddBlockedSlot}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Bloquer le créneau
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Créneaux bloqués</h4>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : blockedSlots && blockedSlots.length > 0 ? (
            <div className="space-y-2">
              {blockedSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {format(new Date(slot.date), 'dd MMMM yyyy', { locale: fr })} à {slot.time_slot}
                    </p>
                    {slot.reason && (
                      <p className="text-sm text-muted-foreground">{slot.reason}</p>
                    )}
                    {slot.type === 'recurring' && (
                      <p className="text-sm text-violet-600">Récurrent chaque semaine</p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteBlockedSlot(slot.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun créneau bloqué</p>
          )}
        </div>
      </div>
    </Card>
  );
};