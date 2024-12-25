import { UseFormReturn } from "react-hook-form";
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
  const groupSizes = ["2", "3", "4", "5", "6", "7", "8"];
  const selectedSize = form.watch("groupSize");

  return (
    <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
      {groupSizes.map((size) => (
        <Button
          key={size}
          type="button"
          variant={selectedSize === size ? "default" : "outline"}
          className={cn(
            "relative h-20 font-semibold",
            selectedSize === size && "bg-violet-600 hover:bg-violet-700"
          )}
          onClick={() => {
            form.setValue("groupSize", size);
            onGroupSizeChange(size);
          }}
        >
          <div className="text-center">
            <div className="text-lg">{size}</div>
            <div className="text-sm opacity-80">pers.</div>
          </div>
        </Button>
      ))}
    </div>
  );
};