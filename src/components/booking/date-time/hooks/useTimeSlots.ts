import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const useTimeSlots = () => {
  const getAvailableSlots = async (date: Date, settings: BookingSettings | null | undefined) => {
    if (!settings?.openingHours) {
      console.log('No opening hours settings found');
      return [];
    }

    const dayOfWeek = date.getDay().toString();
    const daySettings = settings.openingHours[dayOfWeek];

    if (!daySettings?.isOpen) {
      console.log('Day is closed:', { date, dayOfWeek });
      return [];
    }

    const slots = daySettings.slots || [];
    console.log('Potential slots for day:', slots);

    try {
      // Formater la date au format YYYY-MM-DD pour Supabase
      const formattedDate = format(date, 'yyyy-MM-dd');

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        console.error('Error checking bookings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier les disponibilités",
          variant: "destructive",
        });
        return [];
      }

      const availableSlots = slots.filter(slot => {
        const slotTime = parseInt(slot.split(':')[0]);
        
        const isBooked = bookings?.some(booking => {
          const bookingStartTime = parseInt(booking.time_slot.split(':')[0]);
          const bookingDuration = parseInt(booking.duration);
          
          return slotTime >= bookingStartTime && slotTime < (bookingStartTime + bookingDuration);
        });
        
        if (isBooked) {
          console.log('Slot is booked:', slot);
        }
        return !isBooked;
      });

      console.log('Available slots after filtering:', availableSlots);
      return availableSlots;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier les disponibilités",
        variant: "destructive",
      });
      return [];
    }
  };

  const getAvailableHoursForSlot = async (
    date: Date, 
    timeSlot: string, 
    settings: BookingSettings | null | undefined
  ) => {
    if (!settings?.openingHours) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier les disponibilités",
        variant: "destructive",
      });
      return 0;
    }

    const daySettings = settings.openingHours[date.getDay().toString()];
    if (!daySettings?.isOpen || !daySettings.slots) {
      console.log('Day is closed or no slots available');
      return 0;
    }

    const slots = daySettings.slots;
    const slotIndex = slots.indexOf(timeSlot);
    if (slotIndex === -1) {
      console.log('Invalid time slot:', timeSlot);
      return 0;
    }

    if (slotIndex === slots.length - 1) {
      console.log('Last slot of the day, limiting to 1 hour');
      return 1;
    }

    const remainingSlots = slots.length - slotIndex - 1;
    const maxPossibleHours = Math.min(4, remainingSlots + 1);

    try {
      // Formater la date au format YYYY-MM-DD pour Supabase
      const formattedDate = format(date, 'yyyy-MM-dd');

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        console.error('Error checking bookings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier les disponibilités",
          variant: "destructive",
        });
        return 0;
      }

      if (!bookings || bookings.length === 0) {
        console.log('No existing bookings, returning max hours:', maxPossibleHours);
        return maxPossibleHours;
      }

      const slotTime = parseInt(timeSlot.split(':')[0]);
      let availableHours = maxPossibleHours;

      bookings.forEach(booking => {
        const bookingStartTime = parseInt(booking.time_slot.split(':')[0]);
        const bookingDuration = parseInt(booking.duration);
        
        if (bookingStartTime > slotTime) {
          const hoursUntilBooking = bookingStartTime - slotTime;
          availableHours = Math.min(availableHours, hoursUntilBooking);
        }
      });

      console.log(`Available hours for slot ${timeSlot}:`, availableHours);
      return availableHours;
    } catch (error) {
      console.error('Error calculating available hours:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier les disponibilités",
        variant: "destructive",
      });
      return 0;
    }
  };

  return {
    getAvailableSlots,
    getAvailableHoursForSlot
  };
};