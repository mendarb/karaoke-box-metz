import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useCalculatePrice } from "@/components/price-calculator/useCalculatePrice";
import { usePriceSettings } from "@/components/price-calculator/usePriceSettings";
import { cn } from "@/lib/utils";

interface BookingFormFieldsProps {
  form: UseFormReturn<any>;
  durations: string[];
  groupSizes: string[];
  isLoading: boolean;
  onPriceCalculated?: (price: number) => void;
}

export const BookingFormFields = ({ 
  form, 
  durations,
  groupSizes,
  isLoading,
  onPriceCalculated 
}: BookingFormFieldsProps) => {
  const { data: settings } = usePriceSettings();
  const { calculatePrice } = useCalculatePrice({ settings });

  // Recalculate price when duration or group size changes
  useEffect(() => {
    const duration = form.watch("duration");
    const groupSize = form.watch("groupSize");
    
    if (duration && groupSize && onPriceCalculated) {
      const price = calculatePrice(groupSize, duration);
      onPriceCalculated(price);
      form.setValue("calculatedPrice", price);
      
      console.log('💰 Prix calculé:', {
        groupSize,
        duration,
        price
      });
    }
  }, [form.watch("duration"), form.watch("groupSize")]);

  return (
    <div className="space-y-6">
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
          <Input 
            {...form.register("timeSlot")} 
            type="number" 
            min="14" 
            max="23" 
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label>Durée (heures)</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {durations.map((duration) => (
            <Button
              key={duration}
              type="button"
              variant={form.watch("duration") === duration ? "default" : "outline"}
              className={cn(
                "w-full",
                form.watch("duration") === duration && "bg-violet-600 hover:bg-violet-700"
              )}
              onClick={() => form.setValue("duration", duration)}
            >
              {duration}h
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label>Nombre de personnes</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {groupSizes.map((size) => (
            <Button
              key={size}
              type="button"
              variant={form.watch("groupSize") === size ? "default" : "outline"}
              className={cn(
                "w-full",
                form.watch("groupSize") === size && "bg-violet-600 hover:bg-violet-700"
              )}
              onClick={() => form.setValue("groupSize", size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label>Message</label>
        <Textarea {...form.register("message")} />
      </div>
    </div>
  );
};