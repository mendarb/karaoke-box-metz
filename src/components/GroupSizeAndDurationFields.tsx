import { UseFormReturn } from "react-hook-form";
import { useCalculatePrice } from "@/components/price-calculator/useCalculatePrice";
import { usePriceSettings } from "@/components/price-calculator/usePriceSettings";
import { GroupSizeSelector } from "@/components/booking/group-size/GroupSizeSelector";
import { DurationSelector } from "@/components/booking/duration/DurationSelector";
import { PriceDisplay } from "@/components/price-calculator/PriceDisplay";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [pricePerPerson, setPricePerPerson] = useState<number>(0);
  const { toast } = useToast();

  const groupSize = form.watch("groupSize");
  const duration = form.watch("duration");

  useEffect(() => {
    // Afficher un toast d'aide lors du premier rendu
    if (!groupSize) {
      toast({
        title: "👥 Sélectionnez la taille du groupe",
        description: "Choisissez le nombre de personnes qui participeront à la session",
      });
    }
  }, []);

  const updatePrices = (size: string, dur: string) => {
    if (size && dur) {
      const calculatedPrice = calculatePrice(size, dur);
      const pricePerPersonPerHour = calculatedPrice / (parseInt(size) * parseInt(dur));
      
      setCurrentPrice(calculatedPrice);
      setPricePerPerson(pricePerPersonPerHour);
      onPriceCalculated(calculatedPrice);
      
      console.log("💰 Prix calculé:", {
        groupSize: size,
        duration: dur,
        totalPrice: calculatedPrice,
        pricePerPerson: pricePerPersonPerHour
      });
    }
  };

  const handleGroupSizeChange = (value: string) => {
    form.setValue("groupSize", value);
    onGroupSizeChange(value);
    
    const currentDuration = form.getValues("duration");
    if (currentDuration) {
      updatePrices(value, currentDuration);
    } else {
      // Afficher un toast pour guider vers la sélection de la durée
      toast({
        title: "⏱️ Choisissez la durée",
        description: "Sélectionnez maintenant la durée de votre session",
      });
    }
  };

  const handleDurationChange = (value: string) => {
    form.setValue("duration", value);
    onDurationChange(value);
    
    const currentGroupSize = form.getValues("groupSize");
    if (currentGroupSize) {
      updatePrices(currentGroupSize, value);
    }
  };

  useEffect(() => {
    if (groupSize && duration) {
      updatePrices(groupSize, duration);
    }
  }, [groupSize, duration, settings]);

  return (
    <div className="space-y-6">
      <GroupSizeSelector 
        form={form} 
        onGroupSizeChange={handleGroupSizeChange} 
      />
      <DurationSelector 
        form={form} 
        onDurationChange={handleDurationChange}
        availableHours={availableHours}
      />
      {groupSize && duration && currentPrice > 0 && (
        <PriceDisplay
          groupSize={groupSize}
          duration={duration}
          price={currentPrice}
          pricePerPersonPerHour={pricePerPerson}
        />
      )}
    </div>
  );
};