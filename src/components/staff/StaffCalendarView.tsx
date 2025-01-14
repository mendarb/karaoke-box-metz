import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { CardContent } from "@/components/ui/card";
import { StaffBookingsList } from "./StaffBookingsList";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarSection } from "./calendar/CalendarSection";

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
        .select("*")
        .eq("date", format(selectedDate, "yyyy-MM-dd"))
        .is("deleted_at", null)
        .neq("status", "cancelled")
        .order("time_slot");

      if (error) throw error;
      console.log("Bookings received:", data);
      return data;
    },
  });

  // Récupérer tous les jours avec des réservations pour le mois en cours
  const { data: bookedDays = [] } = useQuery({
    queryKey: ["booked-days"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("date")
        .is("deleted_at", null)
        .neq("status", "cancelled");

      if (error) throw error;
      return data.map((booking) => new Date(booking.date));
    },
  });

  return (
    <>
      <CalendarHeader onLogout={onLogout} />
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <CalendarSection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isLoading={isLoading}
            bookedDays={bookedDays}
          />
          <div>
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