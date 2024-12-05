import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { BookingsTable } from "./BookingsTable";
import { BookingDetailsDialog } from "./BookingDetailsDialog";
import { useBookings, Booking } from "@/hooks/useBookings";
import { useBookingStatus } from "@/hooks/useBookingStatus";
import { DashboardStats } from "./DashboardStats";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { DashboardSidebar } from "./DashboardSidebar";

export const AdminDashboard = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { bookings, isLoading, fetchBookings } = useBookings();
  const { updateBookingStatus } = useBookingStatus(fetchBookings);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
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

    checkAdminAccess();
  }, [toast, navigate, fetchBookings]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
        
        <ResizablePanel defaultSize={80}>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
            
            <div className="mb-8">
              <DashboardStats bookings={bookings} />
            </div>
            
            <div className="bg-card rounded-lg shadow-lg p-6">
              <BookingsTable
                data={bookings}
                onStatusChange={updateBookingStatus}
                onViewDetails={(booking) => setSelectedBooking(booking)}
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