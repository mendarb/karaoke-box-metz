import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

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
      <Label className="text-base font-medium text-gray-700">Nombre de personnes</Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {["2", "3", "4", "5"].map((size) => (
          <Button
            key={size}
            type="button"
            variant={selectedSize === size ? "default" : "outline"}
            className={cn(
              "h-12 px-4 rounded-lg border-gray-200",
              selectedSize === size ? "bg-violet-600 hover:bg-violet-700 text-white" : "bg-white hover:bg-gray-50",
              "justify-center items-center gap-2"
            )}
            onClick={() => onGroupSizeChange(size)}
          >
            <Users className="h-4 w-4" />
            {size}
            <span className="text-sm">pers.</span>
          </Button>
        ))}
      </div>
    </div>
  );
};