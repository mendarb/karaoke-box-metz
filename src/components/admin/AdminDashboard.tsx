import { useState, useEffect, useCallback } from "react";
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
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminAccess = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return false;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const isAdminUser = user?.email === "mendar.bouchali@gmail.com";
      
      if (!isAdminUser) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'accès à cette page.",
          variant: "destructive",
        });
        navigate("/");
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast({
        title: "Erreur d'authentification",
        description: "Veuillez vous reconnecter.",
        variant: "destructive",
      });
      navigate("/login");
      return false;
    }
  }, [navigate, toast]);

  useEffect(() => {
    let mounted = true;

    const initializeAdmin = async () => {
      const hasAccess = await checkAdminAccess();
      if (mounted) {
        setIsAdmin(hasAccess);
        setIsCheckingAuth(false);
        if (hasAccess) {
          await fetchBookings();
        }
      }
    };

    initializeAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        if (mounted) {
          navigate("/login");
        }
      } else if (mounted) {
        const hasAccess = await checkAdminAccess();
        setIsAdmin(hasAccess);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminAccess, navigate, fetchBookings]);

  if (isCheckingAuth || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
            <div className="bg-white rounded-lg shadow-lg p-6">
              <BookingsTable
                data={bookings}
                onStatusChange={updateBookingStatus}
                onViewDetails={setSelectedBooking}
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