import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSlots } from "./TimeSlots";
import { Clock } from "lucide-react";

interface TimeSlotsSectionProps {
  form: UseFormReturn<any>;
  availableSlots: string[];
  isLoading: boolean;
}

export const TimeSlotsSection = ({
  form,
  availableSlots,
  isLoading
}: TimeSlotsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-violet-500" />
          Créneaux disponibles
        </CardTitle>
        <CardDescription>
          Sélectionnez l'heure qui vous convient le mieux
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TimeSlots
          value={form.watch("timeSlot")}
          onChange={(value) => form.setValue("timeSlot", value)}
          availableSlots={availableSlots}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};