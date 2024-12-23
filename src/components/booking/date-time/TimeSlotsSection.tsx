import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { TimeSlots } from "./TimeSlots";

interface TimeSlotsSectionProps {
  form: UseFormReturn<any>;
  availableSlots: string[];
  isLoading?: boolean;
}

export const TimeSlotsSection = ({
  form,
  availableSlots,
  isLoading = false
}: TimeSlotsSectionProps) => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <TimeSlots
          form={form}
          availableSlots={availableSlots}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};