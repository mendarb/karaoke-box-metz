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

  const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  
  const dayOfWeek = localDate.getDay().toString();
  const daySettings = settings.openingHours[dayOfWeek];

  if (!daySettings?.isOpen) {
    console.log('❌ Jour fermé:', {
      date: localDate.toISOString(),
      dayOfWeek,
      isOpen: daySettings?.isOpen
    });
    return [];
  }

  const slots = daySettings.slots || [];
  console.log('🔍 Vérification des créneaux pour la date:', localDate.toISOString().split('T')[0]);

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('time_slot, duration')
      .eq('date', localDate.toISOString().split('T')[0])
      .neq('status', 'cancelled')
      .is('deleted_at', null)
      .eq('payment_status', 'paid');

    if (error) {
      console.error('❌ Erreur lors de la récupération des réservations:', error);
      throw error;
    }

    console.log('✅ Réservations trouvées:', bookings);

    return slots.filter(slot => {
      const slotTime = parseInt(slot.split(':')[0]);
      const isSlotAvailable = !bookings?.some(booking => {
        const bookingStartTime = parseInt(booking.time_slot);
        const bookingDuration = parseInt(booking.duration);
        const bookingEndTime = bookingStartTime + bookingDuration;

        const overlap = (
          (slotTime >= bookingStartTime && slotTime < bookingEndTime) ||
          (slotTime + 1 > bookingStartTime && slotTime + 1 <= bookingEndTime)
        );

        if (overlap) {
          console.log(`❌ Créneau ${slot} indisponible - chevauche la réservation ${bookingStartTime}:00-${bookingEndTime}:00`);
        }

        return overlap;
      });

      if (isSlotAvailable) {
        console.log(`✅ Créneau ${slot} disponible`);
      }

      return isSlotAvailable;
    });
  } catch (error) {
    console.error('❌ Erreur récupération créneaux:', error);
    return slots;
  }
};