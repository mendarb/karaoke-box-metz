import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { DashboardContent } from "./dashboard/DashboardContent";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import { useBookings } from "@/hooks/useBookings";
import type { Booking } from "@/hooks/useBookings";
import { BookingDetailsDialog } from "./BookingDetailsDialog";

export const AdminDashboard = () => {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: bookings = [], isLoading: isBookingsLoading } = useBookings();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, isAdminLoading, navigate, toast]);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  if (isAdminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <DashboardContent 
        bookings={bookings} 
        isLoading={isBookingsLoading}
        onViewDetails={handleViewDetails}
      />
      {selectedBooking && (
        <BookingDetailsDialog
          booking={selectedBooking}
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
};