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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          navigate("/login");
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
          title: "Erreur d'authentification",
          description: "Veuillez vous reconnecter.",
          variant: "destructive",
        });
        navigate("/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, navigate, fetchBookings]);

  const renderContent = () => {
    if (isCheckingAuth || isLoading) {
      return (
        <div className="flex-1 p-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded h-[500px] animate-pulse"></div>
        </div>
      );
    }

    return (
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
        <div className="mb-8">
          <DashboardStats bookings={bookings} />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <BookingsTable
            data={bookings}
            onStatusChange={updateBookingStatus}
            onViewDetails={setSelectedBooking}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <DashboardSidebar />
        </ResizablePanel>
        <ResizablePanel defaultSize={80}>
          {renderContent()}
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