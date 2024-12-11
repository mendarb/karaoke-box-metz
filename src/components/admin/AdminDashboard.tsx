import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BookingsTable } from "./BookingsTable";
import { BookingDetailsDialog } from "./BookingDetailsDialog";
import { DashboardStats } from "./DashboardStats";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { DashboardSidebar } from "./DashboardSidebar";
import { Booking } from "@/hooks/useBookings";
import { useBookingMutations } from "@/hooks/useBookingMutations";
import { useUserState } from "@/hooks/useUserState";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { AdminLoadingState } from "./AdminLoadingState";

export const AdminDashboard = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { updateBookingStatus } = useBookingMutations();
  const { isAdmin, user } = useUserState();
  
  useAdminCheck();

  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session);
        
        if (!session?.user?.email) {
          console.log("No session or email found");
          return [];
        }

        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select('*')
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
  });

  if (error) {
    console.error('Query error:', error);
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
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <DashboardSidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
            <div className="mb-8">
              <DashboardStats bookings={bookings} />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <BookingsTable
                data={bookings}
                onStatusChange={updateBookingStatus}
                onViewDetails={setSelectedBooking}
                isLoading={isLoading}
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