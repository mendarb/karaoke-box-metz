import { supabase } from "@/lib/supabase";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";
import { convertJsWeekDayToSettings } from "./dateConversion";

export const getAvailableSlots = async (
  date: Date,
  settings: BookingSettings | null | undefined
): Promise<string[]> => {
  if (!settings?.openingHours) {
    console.log('❌ Pas de paramètres d\'horaires');
    return [];
  }

  if (settings.isTestMode) {
    return ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  }

  const settingsWeekDay = convertJsWeekDayToSettings(date.getDay());
  const daySettings = settings.openingHours[settingsWeekDay];

  if (!daySettings?.isOpen) {
    console.log('❌ Jour fermé:', { 
      date: date.toISOString(), 
      jsWeekDay: date.getDay(),
      settingsWeekDay,
      isOpen: daySettings?.isOpen,
      openingHours: settings.openingHours
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

    if (error) throw error;

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
};

export const getAvailableHoursForSlot = async (
  date: Date,
  timeSlot: string,
  settings: BookingSettings | null | undefined
): Promise<number> => {
  if (!settings?.openingHours) return 0;

  if (settings.isTestMode) {
    return 4;
  }

  const settingsWeekDay = convertJsWeekDayToSettings(date.getDay());
  const daySettings = settings.openingHours[settingsWeekDay];
  
  if (!daySettings?.isOpen) {
    console.log('❌ Jour fermé:', { 
      date: date.toISOString(), 
      jsWeekDay: date.getDay(),
      settingsWeekDay,
      isOpen: daySettings?.isOpen,
      openingHours: settings.openingHours
    });
    return 0;
  }

  const slots = daySettings.slots || [];
  const slotIndex = slots.indexOf(timeSlot);
  
  if (slotIndex === -1) return 0;
  if (slotIndex === slots.length - 1) return 1;

  const remainingSlots = slots.length - slotIndex - 1;
  const maxPossibleHours = Math.min(4, remainingSlots + 1);

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date.toISOString().split('T')[0])
      .neq('status', 'cancelled')
      .is('deleted_at', null);

    if (error) throw error;

    if (!bookings?.length) {
      return maxPossibleHours;
    }

    const slotTime = parseInt(timeSlot.split(':')[0]);
    let availableHours = maxPossibleHours;

    bookings.forEach(booking => {
      const bookingStartTime = parseInt(booking.time_slot.split(':')[0]);
      if (bookingStartTime > slotTime) {
        availableHours = Math.min(availableHours, bookingStartTime - slotTime);
      }
    });

    return availableHours;
  } catch (error) {
    console.error('❌ Erreur calcul heures disponibles:', error);
    return maxPossibleHours;
  }
};