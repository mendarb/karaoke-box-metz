import { supabase } from "@/lib/supabase";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const useTimeSlots = () => {
  const getTestModeSlots = () => {
    return ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  };

  const normalizeTimeSlot = (timeSlot: string): string => {
    // Ensure consistent HH:00 format
    const hour = parseInt(timeSlot.split(':')[0]);
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getAvailableHoursForSlot = async (
    date: Date,
    timeSlot: string,
    settings: BookingSettings | null | undefined
  ): Promise<number> => {
    if (!settings?.openingHours) {
      console.log('❌ Pas de paramètres d\'horaires');
      return 0;
    }

    if (settings.isTestMode) {
      return 4;
    }

    const daySettings = settings.openingHours[date.getDay().toString()];
    if (!daySettings?.isOpen || !daySettings.slots) {
      return 0;
    }

    const slots = daySettings.slots;
    const normalizedTimeSlot = normalizeTimeSlot(timeSlot);
    const selectedSlotIndex = slots.indexOf(normalizedTimeSlot);
    if (selectedSlotIndex === -1) {
      return 0;
    }

    try {
      // Convertir le créneau sélectionné en heure
      const selectedHour = parseInt(normalizedTimeSlot.split(':')[0]);
      
      // Trouver l'heure de fermeture
      const lastSlot = slots[slots.length - 1];
      const closingHour = parseInt(lastSlot.split(':')[0]);
      
      // Calculer les heures jusqu'à la fermeture
      const hoursUntilClosing = closingHour - selectedHour + 1;

      console.log('🕒 Calcul initial:', {
        selectedHour,
        closingHour,
        hoursUntilClosing,
        normalizedTimeSlot
      });

      // Récupérer les réservations payées pour cette date
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('time_slot, duration')
        .eq('date', date.toISOString().split('T')[0])
        .eq('payment_status', 'paid')
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .order('time_slot', { ascending: true });

      if (error) {
        console.error('❌ Erreur lors de la vérification des réservations:', error);
        return Math.min(4, hoursUntilClosing);
      }

      // Normaliser les créneaux des réservations existantes
      const normalizedBookings = bookings?.map(booking => ({
        ...booking,
        time_slot: normalizeTimeSlot(booking.time_slot),
        duration: parseInt(booking.duration)
      }));

      console.log('📊 Réservations normalisées:', normalizedBookings);

      // Trouver la prochaine réservation après le créneau sélectionné
      const nextBooking = normalizedBookings?.find(booking => {
        const bookingHour = parseInt(booking.time_slot);
        return bookingHour > selectedHour;
      });

      let availableHours = 4;

      if (nextBooking) {
        const nextBookingHour = parseInt(nextBooking.time_slot);
        const hoursUntilNextBooking = nextBookingHour - selectedHour;
        
        console.log('📊 Prochaine réservation:', {
          nextBookingHour,
          hoursUntilNextBooking,
          currentMax: availableHours,
          nextBookingDetails: nextBooking
        });

        availableHours = Math.min(availableHours, hoursUntilNextBooking);
      }

      // Prendre le minimum entre les heures disponibles jusqu'à la prochaine réservation,
      // les heures jusqu'à la fermeture, et la limite de 4 heures
      const finalAvailableHours = Math.min(availableHours, hoursUntilClosing, 4);

      console.log('✅ Heures disponibles calculées:', {
        créneau: normalizedTimeSlot,
        heuresDisponibles: finalAvailableHours,
        réservationsExistantes: normalizedBookings,
        limiteFermeture: hoursUntilClosing,
        limiteRéservation: availableHours
      });

      return finalAvailableHours;
    } catch (error) {
      console.error('❌ Erreur lors du calcul des heures disponibles:', error);
      return 0;
    }
  };

  const getAvailableSlots = async (
    date: Date,
    settings: BookingSettings | null | undefined
  ): Promise<{ slots: string[], blockedSlots: Set<string> }> => {
    if (!settings?.openingHours) {
      console.log('❌ Pas de paramètres d\'horaires');
      return { slots: [], blockedSlots: new Set() };
    }

    if (settings.isTestMode) {
      return { slots: getTestModeSlots(), blockedSlots: new Set() };
    }

    const dayOfWeek = date.getDay().toString();
    const daySettings = settings.openingHours[dayOfWeek];

    if (!daySettings?.isOpen) {
      console.log('❌ Jour fermé:', {
        date: date.toISOString(),
        dayOfWeek,
        isOpen: daySettings?.isOpen
      });
      return { slots: [], blockedSlots: new Set() };
    }

    const slots = daySettings.slots || [];
    console.log('🔍 Vérification des créneaux pour la date:', date.toISOString().split('T')[0]);

    try {
      // Récupérer les créneaux bloqués pour cette date
      const { data: blockedSlots, error: blockedError } = await supabase
        .from('blocked_time_slots')
        .select('time_slot')
        .eq('date', date.toISOString().split('T')[0]);

      if (blockedError) {
        console.error('❌ Erreur lors de la récupération des créneaux bloqués:', blockedError);
        throw blockedError;
      }

      const blockedTimeSlots = new Set(blockedSlots?.map(slot => slot.time_slot) || []);
      console.log('🚫 Créneaux bloqués:', Array.from(blockedTimeSlots));

      // Récupérer les réservations existantes
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('time_slot, duration')
        .eq('date', date.toISOString().split('T')[0])
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('❌ Erreur lors de la récupération des réservations:', error);
        throw error;
      }

      console.log('✅ Réservations trouvées:', bookings);

      // Retourner tous les créneaux et les créneaux bloqués séparément
      return {
        slots: slots,
        blockedSlots: blockedTimeSlots
      };
    } catch (error) {
      console.error('❌ Erreur récupération créneaux:', error);
      return { slots: slots, blockedSlots: new Set() };
    }
  };

  return {
    getAvailableSlots,
    getAvailableHoursForSlot
  };
};