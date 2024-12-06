import { DashboardSidebar } from "@/components/admin/DashboardSidebar";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { BookingDetailsDialog } from "@/components/admin/BookingDetailsDialog";
import { Booking } from "@/hooks/useBookings";
import { useToast } from "@/components/ui/use-toast";

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
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
    },
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

  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <DashboardSidebar />
        </ResizablePanel>
        
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

              <div className="bg-card rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">
                  {selectedDate ? (
                    `Réservations du ${format(selectedDate, 'd MMMM yyyy', { locale: fr })}`
                  ) : (
                    'Sélectionnez une date'
                  )}
                </h2>
                
                <div className="space-y-4">
                  {bookingsForSelectedDate.length === 0 ? (
                    <p className="text-muted-foreground">Aucune réservation pour cette date</p>
                  ) : (
                    bookingsForSelectedDate.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div>
                          <p className="font-medium">{booking.user_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.time_slot}h - {parseInt(booking.time_slot) + parseInt(booking.duration)}h
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                          </Badge>
                          <Badge variant="outline">{booking.group_size} pers.</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
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