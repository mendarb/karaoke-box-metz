import { UseFormReturn } from "react-hook-form";
import { UserSelection } from "../UserSelection";
import { Button } from "@/components/ui/button";

interface ClientSelectionProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export const ClientSelection = ({ form, onNext }: ClientSelectionProps) => {
  const handleNext = () => {
    if (form.getValues("email")) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sélection du client</h2>
        <UserSelection form={form} />
      </div>

      <Button 
        onClick={handleNext}
        disabled={!form.getValues("email")}
        className="w-full"
      >
        Suivant
      </Button>
    </div>
  );
};