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
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
      return data.map(booking => new Date(booking.date));
    },
  });

  const modifiers = {
    booked: (date: Date) => 
      bookedDays.some(bookedDate => 
        format(bookedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
  };

  const modifiersStyles = {
    booked: {
      backgroundColor: '#f3f4f6',
      borderRadius: '0.5rem',
      color: '#111827',
      fontWeight: 'bold'
    }
  };

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
          <Button variant="outline" size="sm" onClick={onLogout} className="hover:bg-destructive/10">
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
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <LoadingSpinner className="h-8 w-8" />
                </div>
              ) : (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={fr}
                  className="rounded-md border bg-white shadow-sm"
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] uppercase",
                    row: "flex w-full mt-2",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md transition-colors",
                    day_range_end: "day-range-end",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                  }}
                />
              )}
            </div>
            {!selectedDate && !isLoading && (
              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary/80">
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