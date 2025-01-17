import { Card } from "@/components/ui/card";
import { BookingSettingsForm } from "./BookingSettingsForm";
import { BlockedTimeSlotsSettings } from "./BlockedTimeSlotsSettings";

export const BookingSettings = () => {
  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-6">
        <div className="space-y-1 mb-4">
          <h2 className="text-base font-medium">Paramètres de réservation</h2>
          <p className="text-sm text-muted-foreground">
            Configurez les horaires, les prix et les périodes de réservation
          </p>
        </div>
        <BookingSettingsForm />
      </Card>

      <BlockedTimeSlotsSettings />
    </div>
  );
};