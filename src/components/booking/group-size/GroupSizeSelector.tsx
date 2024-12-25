import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GroupSizeSelectorProps {
  form: UseFormReturn<any>;
  onGroupSizeChange: (size: string) => void;
}

export const GroupSizeSelector = ({
  form,
  onGroupSizeChange,
}: GroupSizeSelectorProps) => {
  const selectedSize = form.watch("groupSize");

  return (
    <div className="space-y-4">
      <Label>Nombre de personnes</Label>
      <div className="flex flex-wrap gap-2">
        {["1", "2", "3", "4"].map((size) => (
          <Button
            key={size}
            type="button"
            variant={selectedSize === size ? "default" : "outline"}
            className={cn(
              "flex-1 min-w-[60px]",
              selectedSize === size && "bg-violet-600 hover:bg-violet-700"
            )}
            onClick={() => onGroupSizeChange(size)}
          >
            {size}
            <span className="ml-1 text-sm">
              personne{parseInt(size) > 1 ? "s" : ""}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};