import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const useTimeSlots = () => {
  const getAvailableSlots = async (date: Date, settings: BookingSettings | null | undefined) => {
    if (!settings?.openingHours) {
      console.log('❌ Pas de paramètres d\'horaires');
      return { slots: [], blockedSlots: new Set<string>() };
    }

    if (settings.isTestMode) {
      return {
        slots: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
        blockedSlots: new Set<string>()
      };
    }

    const dayOfWeek = date.getDay().toString();
    const daySettings = settings.openingHours[dayOfWeek];

    if (!daySettings?.isOpen) {
      console.log('❌ Jour fermé:', {
        date: date.toISOString(),
        dayOfWeek,
        isOpen: daySettings?.isOpen
      });
      return { slots: [], blockedSlots: new Set<string>() };
    }

    const slots = daySettings.slots || [];
    console.log('🕒 Créneaux disponibles pour le jour:', {
      date: date.toISOString().split('T')[0],
      slots
    });

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('time_slot, duration')
        .eq('date', format(date, 'yyyy-MM-dd'))
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('❌ Erreur lors de la récupération des réservations:', error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier les disponibilités",
          variant: "destructive",
        });
        return { slots: [], blockedSlots: new Set<string>() };
      }

      const blockedSlots = new Set<string>();

      bookings?.forEach(booking => {
        const startHour = parseInt(booking.time_slot);
        const duration = parseInt(booking.duration);
        const endHour = startHour + duration;

        // Bloquer tous les créneaux qui se chevauchent avec cette réservation
        for (let hour = startHour; hour < endHour; hour++) {
          blockedSlots.add(`${hour.toString().padStart(2, '0')}:00`);
        }
      });

      console.log('✅ Créneaux disponibles après filtrage:', {
        availableSlots: slots.filter(slot => !blockedSlots.has(slot)),
        blockedSlots: Array.from(blockedSlots)
      });

      return { slots, blockedSlots };
    } catch (error) {
      console.error('❌ Erreur récupération créneaux:', error);
      return { slots: slots, blockedSlots: new Set<string>() };
    }
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
    const slotIndex = slots.indexOf(timeSlot);
    if (slotIndex === -1) {
      return 0;
    }

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('time_slot, duration')
        .eq('date', format(date, 'yyyy-MM-dd'))
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('❌ Erreur lors de la vérification des réservations:', error);
        return 4; // Valeur par défaut en cas d'erreur
      }

      const selectedHour = parseInt(timeSlot);
      let maxAvailableHours = 4; // Maximum par défaut

      // Calculer les heures disponibles jusqu'à la fermeture
      const lastSlot = slots[slots.length - 1];
      const closingHour = parseInt(lastSlot);
      const hoursUntilClosing = closingHour - selectedHour + 1;
      maxAvailableHours = Math.min(maxAvailableHours, hoursUntilClosing);

      console.log('🕒 Calcul des heures disponibles:', {
        selectedHour,
        closingHour,
        hoursUntilClosing,
        maxAvailableHours
      });

      // Vérifier les réservations existantes
      if (bookings && bookings.length > 0) {
        bookings.forEach(booking => {
          const bookingStartHour = parseInt(booking.time_slot);
          const bookingDuration = parseInt(booking.duration);
          
          // Si la réservation commence après notre créneau sélectionné
          if (bookingStartHour > selectedHour) {
            const hoursUntilNextBooking = bookingStartHour - selectedHour;
            maxAvailableHours = Math.min(maxAvailableHours, hoursUntilNextBooking);
            console.log('📊 Réservation trouvée:', {
              bookingStartHour,
              bookingDuration,
              hoursUntilNextBooking,
              updatedMaxHours: maxAvailableHours
            });
          }
        });
      }

      console.log('✅ Heures disponibles calculées:', {
        créneau: timeSlot,
        heuresDisponibles: maxAvailableHours,
        réservationsExistantes: bookings?.map(b => ({
          début: b.time_slot,
          durée: b.duration
        }))
      });

      return maxAvailableHours;
    } catch (error) {
      console.error('❌ Erreur lors du calcul des heures disponibles:', error);
      return 4; // Valeur par défaut en cas d'erreur
    }
  };

  return {
    getAvailableSlots,
    getAvailableHoursForSlot
  };
};