import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DateTimeFields } from "@/components/booking/DateTimeFields";
import { GroupSizeAndDurationFields } from "@/components/GroupSizeAndDurationFields";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookingDetailsProps {
  form: UseFormReturn<any>;
  durations: string[];
  groupSizes: string[];
  isLoading: boolean;
  onPriceCalculated: (price: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export const BookingDetails = ({
  form,
  durations,
  groupSizes,
  isLoading,
  onPriceCalculated,
  onBack,
  onNext,
}: BookingDetailsProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Détails de la réservation</h2>
          
          <DateTimeFields 
            form={form}
            onAvailabilityChange={() => {}}
          />

          <GroupSizeAndDurationFields
            form={form}
            onGroupSizeChange={(size) => form.setValue("groupSize", size)}
            onDurationChange={(duration) => form.setValue("duration", duration)}
            onPriceCalculated={onPriceCalculated}
            availableHours={4}
          />
        </div>

        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            Retour
          </Button>
          <Button 
            onClick={onNext}
            disabled={isLoading}
            className="w-full"
          >
            Suivant
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};