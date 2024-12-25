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
      <Label className="text-gray-700 font-normal">Nombre de personnes</Label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["2", "3", "4", "5", "6", "7", "8", "9", "10"].map((size) => (
          <Button
            key={size}
            type="button"
            variant={selectedSize === size ? "default" : "outline"}
            className={cn(
              "h-12 px-3 rounded border-gray-200",
              selectedSize === size ? "bg-violet-600 hover:bg-violet-700 text-white" : "bg-white hover:bg-gray-50",
              "whitespace-nowrap min-w-[80px]"
            )}
            onClick={() => onGroupSizeChange(size)}
          >
            {size}
            <span className="ml-1 text-sm">
              personnes
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};