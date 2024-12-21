import { useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export const useRealtimeBookings = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          // Invalider et recharger les données des réservations
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
          queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};