import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar as CalendarIcon, Info } from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StaffBookingsList } from "./StaffBookingsList";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StaffCalendarViewProps {
  onLogout: () => void;
}

export const StaffCalendarView = ({ onLogout }: StaffCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["staff-bookings", selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select("date, time_slot, duration, group_size, user_name, user_email, user_phone")
        .eq("date", format(selectedDate, "yyyy-MM-dd"))
        .is("deleted_at", null)
        .neq("status", "cancelled")
        .order("time_slot");

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <CardHeader className="space-y-4 border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Calendrier des réservations</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
        <CardDescription>
          Consultez et gérez les réservations par date
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                className="rounded-md border bg-white shadow-sm"
              />
            </div>
            {!selectedDate && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Sélectionnez une date pour voir les réservations
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="bg-muted/50 rounded-lg">
            <StaffBookingsList
              bookings={bookings}
              selectedDate={selectedDate}
              isLoading={isLoading}
            />
          </div>
        </div>
      </CardContent>
    </>
  );
};