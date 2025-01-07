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
    <div className="flex justify-between items-center pt-6 border-t border-gray-100">
      {currentStep > 1 ? (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2 hover:bg-gray-100 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Précédent
        </Button>
      ) : (
        <div></div>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#ec6342] hover:bg-[#d55538] text-white flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-100"
      >
        {isSubmitting ? (
          "Chargement..."
        ) : currentStep < 4 ? (
          <>
            Suivant
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </>
        ) : (
          "Confirmer et payer"
        )}
      </Button>
    </div>
  );
};