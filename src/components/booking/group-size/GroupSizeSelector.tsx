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
  const groupSizes = [
    { label: "3 et moins", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6 et plus", value: "6" }
  ];
  
  const selectedSize = form.watch("groupSize");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {groupSizes.map(({ label, value }) => (
        <Button
          key={value}
          type="button"
          variant={selectedSize === value ? "default" : "outline"}
          className={cn(
            "relative h-20 font-semibold",
            selectedSize === value && "bg-violet-600 hover:bg-violet-700"
          )}
          onClick={() => {
            form.setValue("groupSize", value);
            onGroupSizeChange(value);
          }}
        >
          <div className="text-center">
            <div className="text-lg">{label}</div>
          </div>
        </Button>
      ))}
    </div>
  );
};