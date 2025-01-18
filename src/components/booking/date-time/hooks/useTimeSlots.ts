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
      date: date.toISOString(),
      slots
    });

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', format(date, 'yyyy-MM-dd'))
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('❌ Erreur lors de la vérification des réservations:', error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier les disponibilités",
          variant: "destructive",
        });
        return { slots: [], blockedSlots: new Set<string>() };
      }

      // Créer un Set des créneaux bloqués
      const blockedSlots = new Set<string>();

      // Pour chaque réservation, bloquer tous les créneaux concernés
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
      console.error('❌ Erreur lors de la récupération des réservations:', error);
      return { slots: [], blockedSlots: new Set<string>() };
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

    const dayOfWeek = date.getDay().toString();
    const daySettings = settings.openingHours[dayOfWeek];

    if (!daySettings?.isOpen) {
      console.log('❌ Jour fermé:', {
        date: date.toISOString(),
        dayOfWeek,
        isOpen: daySettings?.isOpen
      });
      return 0;
    }

    const slots = daySettings.slots || [];
    const slotIndex = slots.indexOf(timeSlot);
    
    if (slotIndex === -1) {
      console.log('❌ Créneau invalide:', timeSlot);
      return 0;
    }

    // Si c'est le dernier créneau de la journée
    if (slotIndex === slots.length - 1) {
      console.log('ℹ️ Dernier créneau de la journée, limité à 1 heure');
      return 1;
    }

    const remainingSlots = slots.length - slotIndex - 1;
    const maxPossibleHours = Math.min(4, remainingSlots + 1);

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', format(date, 'yyyy-MM-dd'))
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('❌ Erreur lors de la vérification des réservations:', error);
        return maxPossibleHours;
      }

      if (!bookings?.length) {
        console.log('✅ Aucune réservation existante, heures disponibles:', maxPossibleHours);
        return maxPossibleHours;
      }

      const slotHour = parseInt(timeSlot);
      let availableHours = maxPossibleHours;

      // Vérifier les réservations qui pourraient limiter la durée disponible
      bookings.forEach(booking => {
        const bookingStartHour = parseInt(booking.time_slot);
        const bookingDuration = parseInt(booking.duration);
        const bookingEndHour = bookingStartHour + bookingDuration;

        // Si une réservation commence après notre créneau sélectionné
        if (bookingStartHour > slotHour) {
          // Calculer combien d'heures sont disponibles jusqu'à la prochaine réservation
          const hoursUntilNextBooking = bookingStartHour - slotHour;
          availableHours = Math.min(availableHours, hoursUntilNextBooking);
          console.log(`ℹ️ Réservation trouvée à ${bookingStartHour}h, limite la durée à ${hoursUntilNextBooking}h`);
        }
      });

      console.log('✅ Heures disponibles pour le créneau:', {
        timeSlot,
        availableHours,
        maxPossibleHours,
        existingBookings: bookings.map(b => ({
          start: b.time_slot,
          duration: b.duration
        }))
      });

      return availableHours;
    } catch (error) {
      console.error('❌ Erreur lors du calcul des heures disponibles:', error);
      return maxPossibleHours;
    }
  };

  return {
    getAvailableSlots,
    getAvailableHoursForSlot
  };
};