import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl md:text-2xl text-gray-900">
          Combien serez-vous ?
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Sélectionnez le nombre de personnes pour votre session karaoké. 
          Le prix sera calculé en fonction du nombre de participants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {groupSizes.map(({ label, value }) => (
            <Button
              key={value}
              type="button"
              variant={selectedSize === value ? "default" : "outline"}
              className={cn(
                "relative h-20 font-semibold transition-all",
                selectedSize === value ? "bg-violet-600 hover:bg-violet-700 scale-105" : "hover:bg-violet-50",
                "flex flex-col items-center justify-center text-center"
              )}
              onClick={() => {
                form.setValue("groupSize", value);
                onGroupSizeChange(value);
              }}
            >
              <div className="text-lg">{label}</div>
              <div className="text-sm opacity-75">
                personnes
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};