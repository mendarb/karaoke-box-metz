import { fr } from "date-fns/locale";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const CalendarHeader = () => {
  return (
    <Alert className="bg-violet-500/5 border-violet-500/20 mb-4">
      <Info className="h-4 w-4 text-violet-500" />
      <AlertDescription className="text-violet-500/80">
        Sélectionnez une date disponible pour votre réservation
      </AlertDescription>
    </Alert>
  );
};