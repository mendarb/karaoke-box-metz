import { Loader2 } from "lucide-react";
import { BookingCard } from "./history/BookingCard";
import { useBookingHistory } from "./history/useBookingHistory";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useUserState } from "@/hooks/useUserState";

export const BookingHistory = () => {
  const { data: bookings, isLoading, error } = useBookingHistory();
  const { toast } = useToast();
  const { user } = useUserState();

  useEffect(() => {
    if (error) {
      console.error('Error in BookingHistory:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos réservations",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  console.log('BookingHistory render:', {
    user,
    bookingsCount: bookings?.length,
    isLoading,
    error
  });

  if (!user) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">Connectez-vous pour voir vos réservations</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">Vous n'avez pas encore de réservations</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Mes réservations
        </h2>
        <p className="text-base sm:text-lg text-gray-600">
          Retrouvez l'historique de toutes vos réservations
        </p>
      </div>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};