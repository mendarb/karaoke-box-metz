import { UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Clock } from "lucide-react";
import { TimeSlotTable } from "./TimeSlotTable";

interface OpeningHoursSettingsProps {
  form: UseFormReturn<any>;
}

export const OpeningHoursSettings = ({ form }: OpeningHoursSettingsProps) => {
  return (
    <div className="space-y-4 bg-card p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-violet-500" />
        <h2 className="font-medium">Horaires d'ouverture</h2>
      </div>

      <Alert variant="info" className="bg-violet-50 border-violet-200">
        <AlertCircle className="h-4 w-4 text-violet-500" />
        <AlertDescription className="text-violet-700">
          Les créneaux doivent être au format 24h (ex: 17:00, 18:00)
        </AlertDescription>
      </Alert>
      
      <TimeSlotTable form={form} />
    </div>
  );
};