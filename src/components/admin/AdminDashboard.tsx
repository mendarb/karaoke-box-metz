import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { BookingActions } from "./BookingActions";
import { BookingDetails } from "./BookingDetails";

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

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Statut de la réservation mis à jour",
      });

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

        fetchBookings();

        // Set up realtime subscription
        const channel = supabase
          .channel('bookings_changes')
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

        // Cleanup function
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
      
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Réservation</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Détails</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell colSpan={7}>
                  <div className="grid grid-cols-7 gap-4">
                    <BookingDetails
                      date={booking.date}
                      timeSlot={booking.time_slot}
                      duration={booking.duration}
                      groupSize={booking.group_size}
                      price={booking.price}
                      userName={booking.user_name}
                      userEmail={booking.user_email}
                      userPhone={booking.user_phone}
                    />
                    <div>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                    <div className="max-w-xs">
                      <p className="truncate text-sm text-gray-500">
                        {booking.message || "-"}
                      </p>
                    </div>
                    <div className="text-right">
                      <BookingActions
                        bookingId={booking.id}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};