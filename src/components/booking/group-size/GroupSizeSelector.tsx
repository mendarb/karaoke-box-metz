import { UseFormReturn } from "react-hook-form";
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
  const groupSizes = [
    { label: "3 et moins", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6 et plus", value: "6" }
  ];
  
  const selectedSize = form.watch("groupSize");

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Users className="h-4 w-4 text-violet-600" />
        <h2 className="text-base text-gray-900">
          Combien serez-vous ?
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        {groupSizes.map(({ label, value }) => (
          <Button
            key={value}
            type="button"
            variant={selectedSize === value ? "default" : "outline"}
            className={cn(
              "relative h-11 font-medium transition-all w-full",
              selectedSize === value ? "bg-violet-600 hover:bg-violet-700" : "hover:bg-violet-50",
              "flex flex-col items-center justify-center text-center",
              "transform active:scale-[0.98] transition-transform duration-200"
            )}
            onClick={() => {
              form.setValue("groupSize", value);
              onGroupSizeChange(value);
            }}
          >
            <div className="text-sm">{label}</div>
            <div className="text-xs opacity-75">
              personnes
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};