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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 pb-safe z-50 shadow-lg">
      <div className="flex justify-between items-center gap-4 max-w-md mx-auto">
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
    </div>
  );
};