import { supabase } from "@/lib/supabase";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const getTestModeSlots = () => {
  return ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
};

export const getAvailableSlots = async (
  date: Date,
  settings: BookingSettings | null | undefined
): Promise<string[]> => {
  if (!settings?.openingHours) {
    console.log('❌ Pas de paramètres d\'horaires');
    return [];
  }

  if (settings.isTestMode) {
    return getTestModeSlots();
  }

  // Utiliser directement le jour JavaScript (0-6)
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