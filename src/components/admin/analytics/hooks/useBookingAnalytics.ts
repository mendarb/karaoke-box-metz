import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PeriodSelection } from "../types/analytics";
import { endOfDay, startOfDay, subDays, startOfYear } from "date-fns";

export const useBookingAnalytics = (period: PeriodSelection) => {
  const getDateRange = () => {
    const now = new Date();
    switch (period.type) {
      case "today":
        return {
          start: startOfDay(now),
          end: endOfDay(now),
          previousStart: startOfDay(subDays(now, 1)),
          previousEnd: endOfDay(subDays(now, 1))
        };
      case "yesterday":
        return {
          start: startOfDay(subDays(now, 1)),
          end: endOfDay(subDays(now, 1)),
          previousStart: startOfDay(subDays(now, 2)),
          previousEnd: endOfDay(subDays(now, 2))
        };
      case "7d":
        return {
          start: subDays(startOfDay(now), 7),
          end: endOfDay(now),
          previousStart: subDays(startOfDay(now), 14),
          previousEnd: subDays(endOfDay(now), 7)
        };
      case "30d":
        return {
          start: subDays(startOfDay(now), 30),
          end: endOfDay(now),
          previousStart: subDays(startOfDay(now), 60),
          previousEnd: subDays(endOfDay(now), 30)
        };
      case "90d":
        return {
          start: subDays(startOfDay(now), 90),
          end: endOfDay(now),
          previousStart: subDays(startOfDay(now), 180),
          previousEnd: subDays(endOfDay(now), 90)
        };
      case "1y":
        return {
          start: startOfYear(now),
          end: endOfDay(now),
          previousStart: startOfYear(subDays(now, 365)),
          previousEnd: endOfDay(subDays(startOfYear(now), 1))
        };
      case "custom":
        if (period.dateRange?.from && period.dateRange?.to) {
          const duration = period.dateRange.to.getTime() - period.dateRange.from.getTime();
          return {
            start: startOfDay(period.dateRange.from),
            end: endOfDay(period.dateRange.to),
            previousStart: startOfDay(new Date(period.dateRange.from.getTime() - duration)),
            previousEnd: endOfDay(new Date(period.dateRange.from.getTime() - 1))
          };
        }
        return {
          start: subDays(startOfDay(now), 7),
          end: endOfDay(now),
          previousStart: subDays(startOfDay(now), 14),
          previousEnd: subDays(endOfDay(now), 7)
        };
      default:
        return {
          start: subDays(startOfDay(now), 7),
          end: endOfDay(now),
          previousStart: subDays(startOfDay(now), 14),
          previousEnd: subDays(endOfDay(now), 7)
        };
    }
  };

  const { start, end, previousStart, previousEnd } = getDateRange();

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['analytics-bookings-details', period],
    queryFn: async () => {
      console.log('Fetching current period bookings:', { start: start.toISOString(), end: end.toISOString() });
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
      console.log('Fetching previous period bookings:', { start: previousStart.toISOString(), end: previousEnd.toISOString() });
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .is('deleted_at', null)
        .gte('created_at', previousStart.toISOString())
        .lte('created_at', previousEnd.toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['analytics-events', period],
    queryFn: async () => {
      console.log('Fetching form events:', { start: start.toISOString(), end: end.toISOString() });
      const { data, error } = await supabase
        .from('user_events')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());
      
      if (error) throw error;
      console.log('Form events fetched:', data);
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
        .lte('created_at', previousEnd.toISOString());
      
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
    period: { start, end, previousStart, previousEnd }
  };
};