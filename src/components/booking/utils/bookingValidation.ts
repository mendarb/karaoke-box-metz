import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

export const checkTimeSlotAvailability = async (
  date: Date, 
  timeSlot: string, 
  duration: string
) => {
  console.log('Checking availability for:', { date, timeSlot, duration });
  
  const requestedStartTime = parseInt(timeSlot.split(':')[0]) * 60 + parseInt(timeSlot.split(':')[1] || '0');
  const requestedDuration = parseInt(duration) * 60;
  const requestedEndTime = requestedStartTime + requestedDuration;

  // Vérifier si le créneau demandé ne dépasse pas minuit
  if (requestedEndTime > 24 * 60) {
    toast({
      title: "Créneau non disponible",
      description: "Le créneau demandé dépasse minuit. Veuillez choisir un horaire plus tôt.",
      variant: "destructive",
    });
    return false;
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('date', date.toISOString().split('T')[0])
    .neq('status', 'cancelled');

  if (error) {
    console.error('Error checking availability:', error);
    return false;
  }

  const hasOverlap = bookings?.some(booking => {
    const existingStartTime = parseInt(booking.time_slot.split(':')[0]) * 60 + parseInt(booking.time_slot.split(':')[1] || '0');
    const existingDuration = parseInt(booking.duration) * 60;
    const existingEndTime = existingStartTime + existingDuration;

    const overlap = (
      (requestedStartTime >= existingStartTime && requestedStartTime < existingEndTime) ||
      (requestedEndTime > existingStartTime && requestedEndTime <= existingEndTime) ||
      (requestedStartTime <= existingStartTime && requestedEndTime >= existingEndTime)
    );

    if (overlap) {
      console.log('Found overlap with booking:', booking);
    }
    return overlap;
  });

  if (hasOverlap) {
    toast({
      title: "Créneau non disponible",
      description: "Ce créneau chevauche une réservation existante. Veuillez choisir un autre horaire.",
      variant: "destructive",
    });
    return false;
  }

  return true;
};