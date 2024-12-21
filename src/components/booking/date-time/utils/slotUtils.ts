import { supabase } from "@/lib/supabase";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";
import { toast } from "@/hooks/use-toast";

export const getAvailableSlots = async (date: Date, settings: BookingSettings | null) => {
  console.log('🔍 Getting available slots for date:', date);

  if (!settings) {
    console.log('❌ No settings available');
    return [];
  }

  // En mode test, retourner tous les créneaux possibles
  if (settings.isTestMode) {
    console.log('🧪 Test mode: returning all possible slots');
    return ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  }

  if (!settings.openingHours) {
    console.log('❌ No opening hours settings found');
    return [];
  }

  const dayOfWeek = date.getDay().toString();
  const daySettings = settings.openingHours[dayOfWeek];

  if (!daySettings?.isOpen) {
    console.log('❌ Day is closed:', { date, dayOfWeek });
    return [];
  }

  const slots = daySettings.slots || [];
  console.log('📋 Potential slots for day:', slots);

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date.toISOString().split('T')[0])
      .neq('status', 'cancelled')
      .is('deleted_at', null);

    if (error) {
      console.error('❌ Error checking bookings:', error);
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
        console.log('❌ Slot is booked:', slot);
      }
      return !isBooked;
    });

    console.log('✅ Available slots after filtering:', availableSlots);
    return availableSlots;
  } catch (error) {
    console.error('❌ Error fetching slots:', error);
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
  console.log('🔍 Calculating available hours for:', { date, timeSlot });

  if (!settings) {
    console.log('❌ No settings available');
    toast({
      title: "Erreur",
      description: "Impossible de vérifier les disponibilités",
      variant: "destructive",
    });
    return 0;
  }

  // En mode test, toujours retourner 4 heures disponibles
  if (settings.isTestMode) {
    console.log('🧪 Test mode: returning maximum hours (4)');
    return 4;
  }

  if (!settings.openingHours) {
    console.log('❌ No opening hours settings found');
    toast({
      title: "Erreur",
      description: "Impossible de vérifier les disponibilités",
      variant: "destructive",
    });
    return 0;
  }

  const daySettings = settings.openingHours[date.getDay().toString()];
  if (!daySettings?.isOpen || !daySettings.slots) {
    console.log('❌ Day is closed or no slots available');
    return 0;
  }

  const slots = daySettings.slots;
  const slotIndex = slots.indexOf(timeSlot);
  if (slotIndex === -1) {
    console.log('❌ Invalid time slot:', timeSlot);
    return 0;
  }

  if (slotIndex === slots.length - 1) {
    console.log('ℹ️ Last slot of the day, limiting to 1 hour');
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
      console.error('❌ Error checking bookings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier les disponibilités",
        variant: "destructive",
      });
      return 0;
    }

    if (!bookings?.length) {
      console.log('✅ No existing bookings, returning max hours:', maxPossibleHours);
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

    console.log('✅ Available hours calculated:', {
      slot: timeSlot,
      availableHours,
      maxPossibleHours
    });
    return availableHours;
  } catch (error) {
    console.error('❌ Error calculating available hours:', error);
    toast({
      title: "Erreur",
      description: "Impossible de vérifier les disponibilités",
      variant: "destructive",
    });
    return 0;
  }
};