import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { TimeSlots } from "./TimeSlots";

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
      <CardContent className="p-4">
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