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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Calendar, Clock, Users, Euro } from "lucide-react";

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

        // Subscribe to realtime changes
        const bookingsSubscription = supabase
          .channel('bookings_changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'bookings' 
            }, 
            () => {
              fetchBookings();
            }
          )
          .subscribe();

        return () => {
          bookingsSubscription.unsubscribe();
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
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(new Date(booking.date), "d MMMM yyyy", { locale: fr })}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      {booking.time_slot}h - {parseInt(booking.time_slot) + parseInt(booking.duration)}h
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{booking.user_name}</div>
                    <div className="text-sm text-gray-500">{booking.user_email}</div>
                    <div className="text-sm text-gray-500">{booking.user_phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4" />
                      {booking.group_size} personnes
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      {booking.duration}h
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Euro className="mr-1 h-4 w-4" />
                    {booking.price}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate text-sm text-gray-500">
                    {booking.message || "-"}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                      >
                        Confirmer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                      >
                        Annuler
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};