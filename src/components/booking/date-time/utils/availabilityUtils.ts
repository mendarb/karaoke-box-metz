import { supabase } from "@/lib/supabase";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";
import { convertJsWeekDayToSettings } from "./dateConversion";

export const getAvailableHoursForSlot = async (
  date: Date,
  timeSlot: string,
  settings: BookingSettings | null | undefined
): Promise<number> => {
  if (!settings?.openingHours) return 0;

  if (settings.isTestMode) {
    return 4;
  }

  const settingsWeekDay = convertJsWeekDayToSettings(date);
  const daySettings = settings.openingHours[settingsWeekDay];

  if (!daySettings?.isOpen) {
    console.log('❌ Jour fermé:', {
      date: date.toISOString(),
      settingsWeekDay,
      isOpen: daySettings?.isOpen
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