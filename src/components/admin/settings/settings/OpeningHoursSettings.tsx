import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Clock } from "lucide-react";
import { TimeSlotTable } from "./TimeSlotTable";

interface OpeningHoursSettingsProps {
  form: UseFormReturn<any>;
}

export const OpeningHoursSettings = ({ form }: OpeningHoursSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-violet-500" />
          Horaires d'ouverture
        </CardTitle>
        <CardDescription>
          Configurez les jours et créneaux d'ouverture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Les créneaux doivent être au format 24h (ex: 17:00, 18:00)
          </AlertDescription>
        </Alert>
        
        <TimeSlotTable form={form} />
      </CardContent>
    </Card>
  );
};