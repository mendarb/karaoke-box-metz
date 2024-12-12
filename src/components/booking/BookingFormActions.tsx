import { Button } from "@/components/ui/button";

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
        >
          Précédent
        </Button>
      )}
      <Button
        type="submit"
        className="w-full bg-violet-600 hover:bg-violet-700"
        disabled={isSubmitting}
      >
        {currentStep === 4 ? (isSubmitting ? "Traitement..." : "Procéder au paiement") : "Suivant"}
      </Button>
    </div>
  );
};