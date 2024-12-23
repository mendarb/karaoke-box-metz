import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";

export const useAvailableSlots = () => {
  const getAvailableSlots = async (date: Date, settings: BookingSettings | null) => {
    console.log('🔍 Récupération des créneaux pour:', date);
    
    if (!settings?.openingHours) {
      console.log('❌ Pas de paramètres d\'horaires');
      return [];
    }

    // En mode test, retourner tous les créneaux
    if (settings.isTestMode) {
      return ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    }

    const dayOfWeek = date.getDay().toString();
    const daySettings = settings.openingHours[dayOfWeek];

    if (!daySettings?.isOpen) {
      console.log('❌ Jour fermé:', { date, dayOfWeek });
      return [];
    }

    const slots = daySettings.slots || [];
    console.log('📋 Créneaux potentiels:', slots);

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', date.toISOString().split('T')[0])
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (error) {
        console.error('❌ Erreur vérification réservations:', error);
        return slots;
      }

      const availableSlots = slots.filter(slot => {
        const slotTime = parseInt(slot.split(':')[0]);
        return !bookings?.some(booking => {
          const bookingStartTime = parseInt(booking.time_slot.split(':')[0]);
          const bookingDuration = parseInt(booking.duration);
          return slotTime >= bookingStartTime && slotTime < (bookingStartTime + bookingDuration);
        });
      });

      console.log('✅ Créneaux disponibles:', availableSlots);
      return availableSlots;
    } catch (error) {
      console.error('❌ Erreur récupération créneaux:', error);
      return slots;
    }
  };

  return { getAvailableSlots };
};