import { Card, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { DurationSelector } from "./duration/DurationSelector";
import { GroupSizeSelector } from "./group-size/GroupSizeSelector";
import { PriceDisplay } from "@/components/price-calculator/PriceDisplay";
import { Users, Clock } from "lucide-react";

interface GroupSizeAndDurationFieldsProps {
  form: UseFormReturn<any>;
  onGroupSizeChange: (size: string) => void;
  onDurationChange: (duration: string) => void;
  onPriceCalculated: (price: number) => void;
  availableHours: number;
}

export const GroupSizeAndDurationFields = ({
  form,
  onGroupSizeChange,
  onDurationChange,
  onPriceCalculated,
  availableHours,
}: GroupSizeAndDurationFieldsProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <Card className="bg-white/50 backdrop-blur-sm border-none">
        <CardContent className="p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-violet-600">
                <Users className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Nombre de personnes</h3>
              </div>
              <GroupSizeSelector
                form={form}
                onGroupSizeChange={onGroupSizeChange}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-violet-600">
                <Clock className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Durée de la session</h3>
              </div>
              <DurationSelector
                form={form}
                onDurationChange={onDurationChange}
                availableHours={availableHours}
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <PriceDisplay
                groupSize={form.watch("groupSize")}
                duration={form.watch("duration")}
                onPriceCalculated={onPriceCalculated}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};