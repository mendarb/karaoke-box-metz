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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-violet-500" />
            <h1 className="text-base font-medium">Calendrier</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Gérez les réservations et consultez le planning
          </p>
        </div>

        {isMobile ? (
          <Tabs defaultValue="calendar" className="space-y-3">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
              <TabsTrigger value="bookings">Réservations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar">
              <Card className="p-2 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card className="relative overflow-hidden bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <BookingsList
                    bookings={bookingsForSelectedDate}
                    onViewDetails={setSelectedBooking}
                    selectedDate={selectedDate}
                  />
                </ScrollArea>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[auto,1fr]">
            <Card className="p-3 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

            <Card className="relative overflow-hidden bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <ScrollArea className="h-[600px]">
                <BookingsList
                  bookings={bookingsForSelectedDate}
                  onViewDetails={setSelectedBooking}
                  selectedDate={selectedDate}
                />
              </ScrollArea>
            </Card>
          </div>
        )}
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