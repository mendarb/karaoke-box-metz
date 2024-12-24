import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useBookingSettings } from "./useBookingSettings";

export const useAvailableSlots = () => {
  const { settings, isTestMode } = useBookingSettings();

  const getAvailableSlots = useCallback(async (date: Date): Promise<string[]> => {
    if (!settings?.openingHours) {
      console.log('❌ Pas de paramètres d\'horaires');
      return [];
    }

    if (isTestMode) {
      return ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    }

    const dayOfWeek = date.getDay().toString();
    const daySettings = settings.openingHours[dayOfWeek];

    if (!daySettings?.isOpen) {
      console.log('❌ Jour fermé:', {
        date: date.toISOString(),
        dayOfWeek,
        isOpen: daySettings?.isOpen
      });
      return [];
    }

    const slots = daySettings.slots || [];

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', date.toISOString().split('T')[0])
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        return slots;
      }

      return slots.filter(slot => {
        const slotTime = parseInt(slot.split(':')[0]);
        return !bookings?.some(booking => {
          const bookingStartTime = parseInt(booking.time_slot.split(':')[0]);
          const bookingDuration = parseInt(booking.duration);
          return slotTime >= bookingStartTime && slotTime < (bookingStartTime + bookingDuration);
        });
      });
    } catch (error) {
      console.error('❌ Erreur récupération créneaux:', error);
      return slots;
    }
  }, [settings, isTestMode]);

  return { getAvailableSlots };
};