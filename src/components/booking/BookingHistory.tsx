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
      console.error('Error fetching bookings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos réservations",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (!user) {
    return (
      <div className="text-center p-8 text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        Connectez-vous pour voir vos réservations
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="text-center p-8 text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        Vous n'avez pas encore de réservations
      </div>
    );
  }

  // Group bookings by date
  const groupedBookings = bookings.reduce((groups: any, booking: any) => {
    const date = booking.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(booking);
    return groups;
  }, {});

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Mes réservations
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Retrouvez l'historique de toutes vos réservations
        </p>
      </div>
      
      {Object.entries(groupedBookings).map(([date, dateBookings]: [string, any]) => (
        <div key={date} className="space-y-4">
          <div className="grid gap-4">
            {dateBookings.map((booking: any) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};