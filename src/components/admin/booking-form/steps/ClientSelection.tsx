import { UseFormReturn } from "react-hook-form";
import { UserSelection } from "../UserSelection";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ClientSelectionProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export const ClientSelection = ({ form, onNext }: ClientSelectionProps) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const handleUserSelected = () => {
    setIsSelecting(false);
  };

  const handleNext = () => {
    if (form.getValues("email")) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sélection du client</h2>
        <UserSelection 
          form={form} 
          onUserSelected={handleUserSelected}
          onSearchStart={() => setIsSelecting(true)}
        />
      </div>

      <Button 
        onClick={handleNext}
        disabled={!form.getValues("email") || isSelecting}
        className="w-full"
      >
        Suivant
      </Button>
    </div>
  );
};