import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BookingDetailsDialog } from "@/components/admin/BookingDetailsDialog";
import { Booking } from "@/hooks/useBookings";
import { useToast } from "@/components/ui/use-toast";
import { DashboardSidebar } from "@/components/admin/DashboardSidebar";
import { BookingsList } from "@/components/admin/calendar/BookingsList";

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
            variant: "destructive",
          });
          return [];
        }

        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('time_slot', { ascending: true });

        if (error) {
          console.error('Error fetching bookings:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les réservations",
            variant: "destructive",
          });
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error in query:', error);
        return [];
      }
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30000,
  });

  // Filtrer les réservations pour la date sélectionnée
  const bookingsForSelectedDate = selectedDate 
    ? bookings.filter(booking => 
        booking.date === format(selectedDate, 'yyyy-MM-dd')
      )
    : [];

  // Obtenir les dates avec des réservations pour le style du calendrier
  const datesWithBookings = bookings.reduce((dates: Date[], booking) => {
    const bookingDate = new Date(booking.date);
    if (!dates.some(date => date.getTime() === bookingDate.getTime())) {
      dates.push(bookingDate);
    }
    return dates;
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <DashboardSidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <CalendarIcon className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Calendrier des réservations</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg shadow-lg p-6">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={fr}
                  modifiers={{
                    booked: datesWithBookings,
                  }}
                  modifiersStyles={{
                    booked: {
                      fontWeight: 'bold',
                      backgroundColor: '#9b87f5',
                      color: 'white',
                    }
                  }}
                  className="rounded-md border"
                />
              </div>

              <BookingsList
                bookings={bookingsForSelectedDate}
                onViewDetails={setSelectedBooking}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {selectedBooking && (
        <BookingDetailsDialog
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};