import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PeriodSelection } from "../types/analytics";
import { endOfDay, startOfDay, subDays, startOfYear } from "date-fns";

export const useBookingAnalytics = (period: PeriodSelection) => {
  const getDateRange = () => {
    const now = new Date();
    switch (period.type) {
      case "24h":
        return {
          start: subDays(startOfDay(now), 1),
          end: endOfDay(now)
        };
      case "7d":
        return {
          start: subDays(startOfDay(now), 7),
          end: endOfDay(now)
        };
      case "30d":
        return {
          start: subDays(startOfDay(now), 30),
          end: endOfDay(now)
        };
      case "90d":
        return {
          start: subDays(startOfDay(now), 90),
          end: endOfDay(now)
        };
      case "1y":
        return {
          start: startOfYear(now),
          end: endOfDay(now)
        };
      case "custom":
        if (period.dateRange?.from && period.dateRange?.to) {
          return {
            start: startOfDay(period.dateRange.from),
            end: endOfDay(period.dateRange.to)
          };
        }
        return {
          start: subDays(startOfDay(now), 7),
          end: endOfDay(now)
        };
      default:
        return {
          start: subDays(startOfDay(now), 7),
          end: endOfDay(now)
        };
    }
  };

  const { start, end } = getDateRange();
  const previousStart = subDays(start, end.getTime() - start.getTime());

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['analytics-bookings-details', period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .is('deleted_at', null)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const { data: previousBookings } = useQuery({
    queryKey: ['analytics-previous-bookings', period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .is('deleted_at', null)
        .gte('created_at', previousStart.toISOString())
        .lt('created_at', start.toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['analytics-events', period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_events')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const { data: previousEvents } = useQuery({
    queryKey: ['analytics-previous-events', period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_events')
        .select('*')
        .gte('created_at', previousStart.toISOString())
        .lt('created_at', start.toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  return {
    bookings,
    previousBookings,
    events,
    previousEvents,
    isLoading: isLoadingBookings || isLoadingEvents,
    period: { start, end, previousStart }
  };
};