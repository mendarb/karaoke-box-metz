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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const checkAdminAndFetchBookings = async () => {
      try {
        // First, check if we have a valid session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!sessionData.session) {
          console.log("No session found");
          navigate("/");
          return;
        }

        // Then get the user details
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User error:', userError);
          throw userError;
        }

        if (!userData.user || userData.user.email !== "mendar.bouchali@gmail.com") {
          console.log("Access denied - not admin");
          toast({
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'accès à cette page.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Finally fetch the bookings
        console.log("Fetching bookings with session:", sessionData.session);
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
          throw bookingsError;
        }

        console.log("Bookings fetched successfully:", bookingsData);
        setBookings(bookingsData || []);
      } catch (error: any) {
        console.error('Error in admin dashboard:', error);
        toast({
          title: "Erreur",
          description: error.message || "Une erreur inattendue est survenue.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndFetchBookings();
  }, [toast, navigate]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", className: "bg-yellow-500" },
      confirmed: { label: "Confirmé", className: "bg-green-500" },
      cancelled: { label: "Annulé", className: "bg-red-500" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

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
              <TableHead>Date</TableHead>
              <TableHead>Horaire</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Groupe</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  {format(new Date(booking.date), "d MMMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell>{booking.time_slot}h</TableCell>
                <TableCell>
                  <div className="font-medium">{booking.user_name}</div>
                  <div className="text-sm text-gray-500">{booking.user_email}</div>
                  <div className="text-sm text-gray-500">{booking.user_phone}</div>
                </TableCell>
                <TableCell>{booking.group_size} pers.</TableCell>
                <TableCell>{booking.duration}h</TableCell>
                <TableCell>{booking.price}€</TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell className="max-w-xs truncate">{booking.message || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};