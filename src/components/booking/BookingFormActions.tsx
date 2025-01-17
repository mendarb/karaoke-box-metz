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
    <div className="flex justify-between items-center gap-4 mt-8">
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex-1 flex items-center justify-center gap-2 text-base font-medium hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
          Précédent
        </Button>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className={`flex-1 flex items-center justify-center gap-2 text-base font-medium bg-violet-600 hover:bg-violet-700 text-white ${currentStep === 1 ? 'w-full' : ''}`}
      >
        {isSubmitting ? (
          "Chargement..."
        ) : currentStep < 3 ? (
          <>
            Suivant
            <ArrowRight className="w-5 h-5" />
          </>
        ) : (
          "Confirmer et payer"
        )}
      </Button>
    </div>
  );
};