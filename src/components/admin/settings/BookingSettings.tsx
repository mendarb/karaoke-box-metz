import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingSettingsForm } from "./BookingSettingsForm";
import { Settings } from "lucide-react";

export const BookingSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-violet-500" />
        <h1 className="text-xl font-semibold">Paramètres de réservation</h1>
      </div>
      <BookingSettingsForm />
    </div>
  );
};