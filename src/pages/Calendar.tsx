import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { BookingDetailsDialog } from "@/components/admin/BookingDetailsDialog";
import { Booking } from "@/hooks/useBookings";
import { useToast } from "@/components/ui/use-toast";
import { BookingsList } from "@/components/admin/calendar/BookingsList";
import { useRealtimeBookings } from "@/hooks/useRealtimeBookings";
import { DashboardLayout } from "@/components/admin/dashboard/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useRealtimeBookings();

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
          .is('deleted_at', null)
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
  });

  const bookingsForSelectedDate = selectedDate 
    ? bookings.filter(booking => 
        booking.date === format(selectedDate, 'yyyy-MM-dd')
      )
    : [];

  const datesWithBookings = bookings.reduce((dates: Date[], booking) => {
    const bookingDate = new Date(booking.date);
    if (!dates.some(date => date.getTime() === bookingDate.getTime())) {
      dates.push(bookingDate);
    }
    return dates;
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <CalendarIcon className="h-5 w-5 text-violet-500" />
          <div>
            <h2 className="text-lg font-semibold">Calendrier des réservations</h2>
            <p className="text-sm text-muted-foreground">
              Gérez les réservations par date
            </p>
          </div>
        </div>

        <div className={`grid gap-6 ${isMobile ? '' : 'lg:grid-cols-[auto,1fr]'}`}>
          <Card className="p-4 shadow-sm bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              className="rounded-md border-none"
            />
          </Card>

          <Card className="relative overflow-hidden shadow-sm bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <ScrollArea className={isMobile ? "h-[calc(100vh-32rem)]" : "h-[600px]"}>
              <div className="p-4">
                <BookingsList
                  bookings={bookingsForSelectedDate}
                  onViewDetails={setSelectedBooking}
                  selectedDate={selectedDate}
                />
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailsDialog
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
        />
      )}
    </DashboardLayout>
  );
};