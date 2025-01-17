import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface GroupSizeSelectorProps {
  form: UseFormReturn<any>;
  onGroupSizeChange: (size: string) => void;
}

export const GroupSizeSelector = ({
  form,
  onGroupSizeChange,
}: GroupSizeSelectorProps) => {
  const groupSizes = [
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6+", value: "6" },
  ];

  const selectedSize = form.watch("groupSize");

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-violet-600" />
        <h2 className="text-lg md:text-xl text-gray-900">
          Combien serez-vous ?
        </h2>
      </div>
      <p className="text-sm text-gray-600">
        Choisissez le nombre de personnes
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {groupSizes.map(({ label, value }) => (
          <Button
            key={value}
            type="button"
            variant={selectedSize === value ? "default" : "outline"}
            className={cn(
              "relative h-14 md:h-16 font-medium transition-all w-full",
              selectedSize === value ? "bg-violet-600 hover:bg-violet-700" : "hover:bg-violet-50",
              "flex flex-col items-center justify-center text-center",
              "transform active:scale-[0.98] transition-transform duration-200"
            )}
            onClick={() => {
              form.setValue("groupSize", value);
              onGroupSizeChange(value);
            }}
          >
            <div className="text-base">{label}</div>
          </Button>
        ))}
      </div>

      {selectedSize === "6" && (
        <Alert variant="warning" className="py-2 border-none bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Pour les groupes de 6 personnes et plus, le maximum est de 10 personnes
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};