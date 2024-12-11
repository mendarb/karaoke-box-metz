import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { BookingsTable } from "./BookingsTable";
import { BookingDetailsDialog } from "./BookingDetailsDialog";
import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "./DashboardStats";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { DashboardSidebar } from "./DashboardSidebar";
import { Booking } from "@/hooks/useBookings";
import { useBookingMutations } from "@/hooks/useBookingMutations";
import { useUserState } from "@/hooks/useUserState";

export const AdminDashboard = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateBookingStatus } = useBookingMutations();
  const { isAdmin } = useUserState();

  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No session found");
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
            variant: "destructive",
          });
          navigate("/");
          return [];
        }

        if (!isAdmin) {
          console.log("Unauthorized access attempt");
          toast({
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'accès à cette page.",
            variant: "destructive",
          });
          navigate("/");
          return [];
        }

        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in query function:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les réservations",
          variant: "destructive",
        });
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30000,
  });

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  if (error) {
    console.error('Query error:', error);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
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