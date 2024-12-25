import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCalculatePrice } from "@/components/price-calculator/useCalculatePrice";
import { cn } from "@/lib/utils";

interface GroupSizeAndDurationFieldsProps {
  form: UseFormReturn<any>;
  onGroupSizeChange: (size: string) => void;
  onDurationChange: (duration: string) => void;
  onPriceCalculated: (price: number) => void;
  availableHours: number;
}

export const GroupSizeAndDurationFields = ({
  form,
  onGroupSizeChange,
  onDurationChange,
  onPriceCalculated,
  availableHours,
}: GroupSizeAndDurationFieldsProps) => {
  const { calculatePrice } = useCalculatePrice();

  const handleGroupSizeChange = (value: string) => {
    form.setValue("groupSize", value);
    onGroupSizeChange(value);
    
    const duration = form.getValues("duration");
    if (duration) {
      const price = calculatePrice(value, duration);
      onPriceCalculated(price);
    }
  };

  const handleDurationChange = (value: string) => {
    form.setValue("duration", value);
    onDurationChange(value);
    
    const groupSize = form.getValues("groupSize");
    if (groupSize) {
      const price = calculatePrice(groupSize, value);
      onPriceCalculated(price);
    }
  };

  console.log('Available hours for duration:', availableHours);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Nombre de personnes</Label>
        <RadioGroup
          defaultValue={form.getValues("groupSize")}
          onValueChange={handleGroupSizeChange}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {["1", "2", "3", "4"].map((size) => (
            <Label
              key={size}
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
              )}
            >
              <RadioGroupItem value={size} className="sr-only" />
              <span className="text-xl font-bold">{size}</span>
              <span className="text-sm">personne{parseInt(size) > 1 ? "s" : ""}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>Durée</Label>
        <RadioGroup
          defaultValue={form.getValues("duration")}
          onValueChange={handleDurationChange}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {["1", "2", "3", "4"].map((duration) => {
            const isDisabled = parseInt(duration) > availableHours;
            return (
              <Label
                key={duration}
                className={cn(
                  "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary",
                  isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                )}
              >
                <RadioGroupItem 
                  value={duration} 
                  className="sr-only" 
                  disabled={isDisabled}
                />
                <span className="text-xl font-bold">{duration}h</span>
                <span className="text-sm">
                  {isDisabled ? "Non disponible" : "heure" + (parseInt(duration) > 1 ? "s" : "")}
                </span>
              </Label>
            )
          })}
        </RadioGroup>
      </div>
    </div>
  );
};