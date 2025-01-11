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
    <div className="bg-white/80 backdrop-blur-sm border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Précédent
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
    </div>
  );
};