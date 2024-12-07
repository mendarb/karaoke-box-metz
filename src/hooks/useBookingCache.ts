import { useQueryClient } from "@tanstack/react-query";
import { Booking } from "./useBookings";

export const useBookingCache = () => {
  const queryClient = useQueryClient();

  const invalidateBookings = () => {
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
  };

  const updateBookingInCache = (updatedBooking: Booking) => {
    queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
      if (!old) return [updatedBooking];
      return old.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      );
    });
  };

  return { invalidateBookings, updateBookingInCache };
};