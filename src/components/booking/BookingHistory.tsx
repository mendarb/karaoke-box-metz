import { Loader2 } from "lucide-react";
import { BookingCard } from "./history/BookingCard";
import { useBookingHistory } from "./history/useBookingHistory";
import { useToast } from "@/hooks/use-toast";
import { useUserState } from "@/hooks/useUserState";
import { useEffect } from "react";

export const BookingHistory = () => {
  const { data: bookings, isLoading, error } = useBookingHistory();
  const { toast } = useToast();
  const { user } = useUserState();

  console.log("BookingHistory component mounted", { user, bookings, isLoading, error });

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

  if (!user) {
    console.log("No user found in BookingHistory");
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">Connectez-vous pour voir vos réservations</p>
      </div>
    );
  }

  if (isLoading) {
    console.log("Loading bookings...");
    return (
      <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow">
        <Loader2 className="h-8 w-8 animate-spin text-kbox-violet" />
      </div>
    );
  }

  if (!bookings?.length) {
    console.log("No bookings found");
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">Vous n'avez pas encore de réservations</p>
      </div>
    );
  }

  console.log("Rendering bookings:", bookings);
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