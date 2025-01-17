import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex justify-between gap-4 ${isMobile ? 'fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50 pb-safe' : 'mt-6'}`}>
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="w-full flex items-center justify-center gap-2 hover:bg-violet-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      )}
      <Button 
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700"
      >
        {currentStep === 3 ? (
          isSubmitting ? "Traitement..." : "Réserver"
        ) : (
          <>
            Suivant
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};