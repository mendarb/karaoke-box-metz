import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface BookingFormActionsProps {
  currentStep: number;
  isSubmitting: boolean;
  onPrevious: () => void;
}

export const BookingFormActions = ({
  currentStep,
  isSubmitting,
  onPrevious,
}: BookingFormActionsProps) => {
  return (
    <div className="flex justify-between items-center gap-4 mt-6">
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2 w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </Button>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 w-full"
      >
        {isSubmitting ? (
          "Chargement..."
        ) : currentStep < 4 ? (
          <>
            Suivant
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          "Confirmer et payer"
        )}
      </Button>
    </div>
  );
};