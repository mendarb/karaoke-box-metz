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
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const { bookings, fetchBookings } = useBookings();
  const { updateBookingStatus } = useBookingStatus(fetchBookings);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!session) {
          console.log("No session found, redirecting to login");
          navigate("/login");
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!user || user.email !== "mendar.bouchali@gmail.com") {
          console.log("Not admin user:", user?.email);
          toast({
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'accès à cette page.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        if (mounted) {
          console.log("Admin session verified, fetching bookings");
          await fetchBookings();
          setSessionChecked(true);
        }
      } catch (error: any) {
        console.error("Session check failed:", error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier vos droits d'accès",
          variant: "destructive",
        });
        navigate("/login");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        console.log("Auth state changed: no session");
        navigate("/login");
      }
    });

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, fetchBookings]);

  if (isLoading || !sessionChecked) {
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