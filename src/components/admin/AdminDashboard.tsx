import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { BookingsTable } from "./BookingsTable";
import { BookingDetailsDialog } from "./BookingDetailsDialog";

type Booking = {
  id: string;
  created_at: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  status: string;
  price: number;
  message: string | null;
  user_email: string;
  user_name: string;
  user_phone: string;
};

export const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true })
        .order('time_slot', { ascending: true });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendBookingEmail = async (booking: Booking) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          to: booking.user_email,
          userName: booking.user_name,
          date: booking.date,
          timeSlot: booking.time_slot,
          duration: booking.duration,
          groupSize: booking.group_size,
          price: booking.price,
          status: booking.status,
        },
      });

      if (error) throw error;
      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de notification",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Statut de la réservation mis à jour",
      });

      // Send email notification
      if (data) {
        await sendBookingEmail(data);
      }

      fetchBookings();
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const checkAdminAndFetchBookings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          navigate("/");
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user || user.email !== "mendar.bouchali@gmail.com") {
          toast({
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'accès à cette page.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        await fetchBookings();

        const channel = supabase.channel('bookings_changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'bookings' 
            }, 
            () => {
              console.log('Received realtime update');
              fetchBookings();
            }
          )
          .subscribe();

        return () => {
          channel.unsubscribe();
        };

      } catch (error: any) {
        console.error('Error in admin dashboard:', error);
        toast({
          title: "Erreur",
          description: error.message || "Une erreur inattendue est survenue.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    checkAdminAndFetchBookings();
  }, [toast, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
      
      <BookingsTable
        data={bookings}
        onStatusChange={handleStatusChange}
        onViewDetails={(booking) => setSelectedBooking(booking)}
      />

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