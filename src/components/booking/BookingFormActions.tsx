import { Button } from "@/components/ui/button";
import { ChevronLeft, ArrowRight, Lock } from "lucide-react";

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
    <div className="flex justify-between items-center pt-6 border-t border-gray-100">
      {currentStep > 1 ? (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2 border-2 border-violet-200 hover:bg-violet-50 hover:border-violet-300 text-violet-700"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </Button>
      ) : (
        <div></div>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200"
      >
        {isSubmitting ? (
          "Chargement..."
        ) : currentStep < 3 ? (
          <>
            Suivant
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Paiement sécurisé
          </>
        )}
      </Button>
    </div>
  );
};