import { supabase } from "@/lib/supabase";
import { BookingSettings } from "@/components/admin/settings/types/bookingSettings";
import { toast } from "@/hooks/use-toast";

export const getAvailableSlots = async (date: Date, settings: BookingSettings | null) => {
  if (!settings?.openingHours) {
    console.log('No opening hours settings found');
    return [];
  }

  const dayOfWeek = date.getDay().toString();
  const daySettings = settings.openingHours[dayOfWeek];

  if (!daySettings?.isOpen) {
    console.log('Day is closed:', { date, dayOfWeek });
    return [];
  }

  const slots = daySettings.slots || [];
  console.log('Potential slots for day:', slots);

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date.toISOString().split('T')[0])
      .neq('status', 'cancelled')
      .is('deleted_at', null);

    if (error) {
      console.error('Error checking bookings:', error);
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
      
      return !isBooked;
    });

    return availableSlots;
  } catch (error) {
    console.error('Error fetching slots:', error);
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
  if (!settings?.openingHours) {
    toast({
      title: "Erreur",
      description: "Impossible de vérifier les disponibilités",
      variant: "destructive",
    });
    return 0;
  }

  const daySettings = settings.openingHours[date.getDay().toString()];
  if (!daySettings?.isOpen || !daySettings.slots) {
    return 0;
  }

  const slots = daySettings.slots;
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

    if (error) {
      console.error('Error checking bookings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier les disponibilités",
        variant: "destructive",
      });
      return 0;
    }

    if (!bookings?.length) return maxPossibleHours;

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
    console.error('Error calculating available hours:', error);
    toast({
      title: "Erreur",
      description: "Impossible de vérifier les disponibilités",
      variant: "destructive",
    });
    return 0;
  }
};