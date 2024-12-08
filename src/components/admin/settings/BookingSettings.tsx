import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingSettingsForm } from "./BookingSettingsForm";

export const BookingSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de réservation</CardTitle>
        <CardDescription>
          Configurez les créneaux horaires, les prix et les réductions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BookingSettingsForm />
      </CardContent>
    </Card>
  );
};