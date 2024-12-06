import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { BookingDetailsDialog } from "@/components/admin/BookingDetailsDialog";
import { Booking } from "@/hooks/useBookings";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import { BookingActions } from "@/components/admin/BookingActions";
import { DashboardSidebar } from "@/components/admin/DashboardSidebar";

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
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
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30000,
    staleTime: 0,
    gcTime: 0,
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['bookings'], (oldData: Booking[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        );
      });

      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });

      // Force un nouveau chargement des données après la mise à jour
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      // En cas d'erreur, on recharge les données pour revenir à l'état correct
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  };

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
                        className="flex flex-col space-y-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{booking.user_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.time_slot}h - {parseInt(booking.time_slot) + parseInt(booking.duration)}h
                            </p>
                          </div>
                          <BookingStatusBadge status={booking.status} />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{booking.group_size} pers.</Badge>
                          <Badge variant="outline">{booking.duration}h</Badge>
                          <Badge variant="outline">{booking.price}€</Badge>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            Détails
                          </Button>
                          <BookingActions
                            bookingId={booking.id}
                            onStatusChange={updateBookingStatus}
                          />
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