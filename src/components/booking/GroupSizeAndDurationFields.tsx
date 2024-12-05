import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { User, Clock, BadgePercent } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceCalculator } from "../PriceCalculator";

interface GroupSizeAndDurationFieldsProps {
  form: UseFormReturn<any>;
  onGroupSizeChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onPriceCalculated: (price: number) => void;
  availableHours?: number;
}

const groupSizes = [
  { value: "2", label: "2 pers." },
  { value: "3", label: "3 pers." },
  { value: "4", label: "4 pers." },
  { value: "5", label: "5 pers." },
  { value: "6", label: "6 pers." },
  { value: "6+", label: "6+ pers." },
];

const durations = [
  { value: "1", label: "1h", discount: false },
  { value: "2", label: "2h", discount: true },
  { value: "3", label: "3h", discount: true },
  { value: "4", label: "4h", discount: true },
];

export const GroupSizeAndDurationFields = ({
  form,
  onGroupSizeChange,
  onDurationChange,
  onPriceCalculated,
  availableHours = 4,
}: GroupSizeAndDurationFieldsProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <FormField
        control={form.control}
        name="groupSize"
        rules={{ required: "La taille du groupe est requise" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Nombre de participants *</FormLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {groupSizes.map((size) => (
                <FormControl key={size.value}>
                  <Button
                    type="button"
                    variant={field.value === size.value ? "default" : "outline"}
                    className={cn(
                      "w-full h-14 text-base gap-2 transition-all duration-200",
                      field.value === size.value 
                        ? "bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-100 scale-105" 
                        : "hover:border-violet-300 hover:scale-105"
                    )}
                    onClick={() => {
                      field.onChange(size.value);
                      onGroupSizeChange(size.value);
                    }}
                  >
                    <User className="w-5 h-5" />
                    {size.label}
                  </Button>
                </FormControl>
              ))}
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        rules={{ required: "La durée est requise" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Durée de la session *</FormLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {durations.map((duration) => {
                const isAvailable = parseInt(duration.value) <= availableHours;
                return (
                  <FormControl key={duration.value}>
                    <Button
                      type="button"
                      variant={field.value === duration.value ? "default" : "outline"}
                      className={cn(
                        "w-full h-14 text-base gap-2 transition-all duration-200 relative",
                        field.value === duration.value 
                          ? "bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-100 scale-105" 
                          : "hover:border-violet-300 hover:scale-105",
                        !isAvailable && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => {
                        if (isAvailable) {
                          field.onChange(duration.value);
                          onDurationChange(duration.value);
                        }
                      }}
                      disabled={!isAvailable}
                    >
                      <Clock className="w-5 h-5" />
                      {duration.label}
                      {duration.discount && isAvailable && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                          -10%
                          <BadgePercent className="w-3 h-3" />
                        </div>
                      )}
                    </Button>
                  </FormControl>
                );
              })}
            </div>
          </FormItem>
        )}
      />

      {form.watch("groupSize") && form.watch("duration") && (
        <PriceCalculator
          groupSize={form.watch("groupSize")}
          duration={form.watch("duration")}
          onPriceCalculated={onPriceCalculated}
        />
      )}
    </div>
  );
};