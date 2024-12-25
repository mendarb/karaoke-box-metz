import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface GroupSizeSelectorProps {
  form: UseFormReturn<any>;
  onGroupSizeChange: (size: string) => void;
}

export const GroupSizeSelector = ({
  form,
  onGroupSizeChange,
}: GroupSizeSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label>Nombre de personnes</Label>
      <RadioGroup
        defaultValue={form.getValues("groupSize")}
        onValueChange={onGroupSizeChange}
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
  );
};