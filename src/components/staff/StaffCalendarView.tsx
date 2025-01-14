import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffBookingsList } from "./StaffBookingsList";

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendrier des réservations</CardTitle>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="rounded-md border"
          />
        </div>
        <div>
          <StaffBookingsList
            bookings={bookings}
            selectedDate={selectedDate}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </>
  );
};