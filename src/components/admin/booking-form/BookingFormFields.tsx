import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookingFormFieldsProps {
  form: UseFormReturn<any>;
  durations: string[];
  groupSizes: string[];
  isLoading: boolean;
}

export const BookingFormFields = ({ 
  form, 
  durations, 
  groupSizes,
  isLoading 
}: BookingFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label>Email</label>
          <Input {...form.register("email")} type="email" required />
        </div>
        <div className="space-y-2">
          <label>Nom complet</label>
          <Input {...form.register("fullName")} required />
        </div>
        <div className="space-y-2">
          <label>Téléphone</label>
          <Input {...form.register("phone")} required />
        </div>
        <div className="space-y-2">
          <label>Date</label>
          <Input {...form.register("date")} type="date" required />
        </div>
        <div className="space-y-2">
          <label>Heure de début</label>
          <Input {...form.register("timeSlot")} type="number" min="14" max="23" required />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-2">Durée (heures)</label>
          <div className="flex flex-wrap gap-2">
            {durations.map((duration) => (
              <Button
                key={duration}
                type="button"
                variant={form.watch("duration") === duration ? "default" : "outline"}
                className={cn(
                  "flex-1 min-w-[60px]",
                  form.watch("duration") === duration && "bg-violet-600 hover:bg-violet-700"
                )}
                onClick={() => form.setValue("duration", duration)}
              >
                {duration}h
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Nombre de personnes</label>
          <div className="flex flex-wrap gap-2">
            {groupSizes.map((size) => (
              <Button
                key={size}
                type="button"
                variant={form.watch("groupSize") === size ? "default" : "outline"}
                className={cn(
                  "flex-1 min-w-[60px]",
                  form.watch("groupSize") === size && "bg-violet-600 hover:bg-violet-700"
                )}
                onClick={() => form.setValue("groupSize", size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label>Message</label>
        <Textarea {...form.register("message")} />
      </div>
    </>
  );
};