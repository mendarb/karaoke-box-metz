import { Card, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { DurationSelector } from "./duration/DurationSelector";
import { GroupSizeSelector } from "./group-size/GroupSizeSelector";
import { PriceDisplay } from "@/components/price-calculator/PriceDisplay";
import { Users, Clock } from "lucide-react";
import { useCalculatePrice } from "@/components/price-calculator/useCalculatePrice";
import { usePriceSettings } from "@/components/price-calculator/usePriceSettings";

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
  const { data: settings } = usePriceSettings();
  const { calculatePrice } = useCalculatePrice({ settings });
  const groupSize = form.watch("groupSize");
  const duration = form.watch("duration");

  // Calculate price and price per person per hour when groupSize or duration changes
  const price = groupSize && duration ? calculatePrice(groupSize, duration) : 0;
  const pricePerPersonPerHour = price > 0 ? price / (parseInt(groupSize) * parseInt(duration)) : 0;

  // Call onPriceCalculated when price changes
  if (price > 0) {
    onPriceCalculated(price);
  }

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

            {groupSize && duration && price > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <PriceDisplay
                  groupSize={groupSize}
                  duration={duration}
                  price={price}
                  pricePerPersonPerHour={pricePerPersonPerHour}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};