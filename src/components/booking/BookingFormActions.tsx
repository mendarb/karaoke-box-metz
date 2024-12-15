import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
    <div className="flex justify-between space-x-4 pb-20 sm:pb-0">
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="w-full"
          disabled={isSubmitting}
        >
          Précédent
        </Button>
      )}
      <Button
        type="submit"
        className="w-full bg-violet-600 hover:bg-violet-700 relative"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {currentStep === 4 ? "Traitement en cours..." : "Chargement..."}
          </>
        ) : (
          currentStep === 4 ? "Procéder au paiement" : "Suivant"
        )}
      </Button>
    </div>
  );
};