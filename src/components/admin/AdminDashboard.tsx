import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BookingDetailsDialog } from "./BookingDetailsDialog";
import { Booking } from "@/hooks/useBookings";
import { useUserState } from "@/hooks/useUserState";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { AdminLoadingState } from "./AdminLoadingState";
import { DashboardLayout } from "./DashboardLayout";
import { DashboardContent } from "./dashboard/DashboardContent";
import { useToast } from "@/components/ui/use-toast";

export const AdminDashboard = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { isAdmin, user } = useUserState();
  const { toast } = useToast();
  
  useAdminCheck();

  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session);
        
        if (!session?.user?.email) {
          console.log("No session or email found");
          return [];
        }

        // Récupérer toutes les réservations non supprimées
        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Fetch error:', fetchError);
          throw fetchError;
        }

        console.log("Fetched bookings:", data);
        return data || [];
      } catch (err) {
        console.error('Query error:', err);
        throw err;
      }
    },
    enabled: !!user && isAdmin,
    refetchInterval: 5000, // Rafraîchir toutes les 5 secondes
  });

  if (error) {
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors du chargement des réservations",
      variant: "destructive",
    });
    return (
      <div className="p-6">
        <h1>Erreur de chargement</h1>
        <p>Une erreur est survenue lors du chargement des données.</p>
      </div>
    );
  }

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <DashboardLayout>
      <DashboardContent 
        bookings={bookings}
        isLoading={isLoading}
        onViewDetails={setSelectedBooking}
      />
      
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