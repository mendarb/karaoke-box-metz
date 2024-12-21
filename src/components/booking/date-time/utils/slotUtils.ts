import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const getAvailableSlots = async (date: Date, settings: BookingSettings | null) => {
  console.log('🔍 Récupération des créneaux disponibles pour la date:', date);

  if (!settings) {
    console.log('❌ Paramètres non disponibles');
    toast({
      title: "Erreur",
      description: "Les paramètres de réservation ne sont pas disponibles",
      variant: "destructive",
    });
    return [];
  }

  // En mode test, retourner tous les créneaux possibles
  if (settings.isTestMode) {
    console.log('🧪 Mode test: retour de tous les créneaux possibles');
    return ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  }

  if (!settings.openingHours) {
    console.log('❌ Horaires d\'ouverture non définis');
    return [];
  }

  const dayOfWeek = date.getDay().toString();
  const daySettings = settings.openingHours[dayOfWeek];

  if (!daySettings?.isOpen) {
    console.log('❌ Jour fermé:', { date, dayOfWeek });
    return [];
  }

  const slots = daySettings.slots || [];
  console.log('📋 Créneaux potentiels pour le jour:', slots);

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date.toISOString().split('T')[0])
      .neq('status', 'cancelled')
      .is('deleted_at', null);

    if (error) {
      console.error('❌ Erreur lors de la vérification des réservations:', error);
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
        console.log('❌ Créneau réservé:', slot);
      }
      return !isBooked;
    });

    console.log('✅ Créneaux disponibles après filtrage:', availableSlots);
    return availableSlots;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des créneaux:', error);
    toast({
      title: "Erreur",
      description: "Impossible de vérifier les disponibilités",
      variant: "destructive",
    });
    return [];
  }
};

export const calculateAvailableHours = async (
  date: Date,
  timeSlot: string,
  settings: BookingSettings | null
): Promise<number> => {
  console.log('🔍 Calcul des heures disponibles pour:', { date, timeSlot });

  if (!settings) {
    console.log('❌ Paramètres non disponibles');
    toast({
      title: "Erreur",
      description: "Les paramètres de réservation ne sont pas disponibles",
      variant: "destructive",
    });
    return 0;
  }

  // En mode test, toujours retourner 4 heures disponibles
  if (settings.isTestMode) {
    console.log('🧪 Mode test: retour du maximum d\'heures (4)');
    return 4;
  }

  if (!settings.openingHours) {
    console.log('❌ Horaires d\'ouverture non définis');
    return 0;
  }

  const daySettings = settings.openingHours[date.getDay().toString()];
  if (!daySettings?.isOpen || !daySettings.slots) {
    console.log('❌ Jour fermé ou pas de créneaux disponibles');
    return 0;
  }

  const slots = daySettings.slots;
  const slotIndex = slots.indexOf(timeSlot);
  if (slotIndex === -1) {
    console.log('❌ Créneau horaire invalide:', timeSlot);
    return 0;
  }

  if (slotIndex === slots.length - 1) {
    console.log('ℹ️ Dernier créneau du jour, limité à 1 heure');
    return 1;
  }

  const remainingSlots = slots.length - slotIndex - 1;
  const maxPossibleHours = Math.min(4, remainingSlots + 1);

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date.toISOString().split('T')[0])
      .neq('status', 'cancelled')
      .is('deleted_at', null);

    if (error) {
      console.error('❌ Erreur lors de la vérification des réservations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier les disponibilités",
        variant: "destructive",
      });
      return 0;
    }

    if (!bookings?.length) {
      console.log('✅ Pas de réservations existantes, retour du maximum d\'heures:', maxPossibleHours);
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

    console.log('✅ Heures disponibles calculées:', {
      slot: timeSlot,
      availableHours,
      maxPossibleHours
    });
    return availableHours;
  } catch (error) {
    console.error('❌ Erreur lors du calcul des heures disponibles:', error);
    toast({
      title: "Erreur",
      description: "Impossible de vérifier les disponibilités",
      variant: "destructive",
    });
    return 0;
  }
};