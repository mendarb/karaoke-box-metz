import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { addDays, startOfDay, format } from "date-fns";

export const checkTimeSlotAvailability = async (
  date: Date, 
  timeSlot: string, 
  duration: string
) => {
  console.log('🔍 Vérification de la disponibilité pour:', {
    date: format(date, 'yyyy-MM-dd'),
    timeSlot,
    duration
  });
  
  const requestedStartTime = parseInt(timeSlot);
  const requestedDuration = parseInt(duration);
  const requestedEndTime = requestedStartTime + requestedDuration;

  // Vérifier si le créneau demandé ne dépasse pas minuit
  if (requestedEndTime > 24) {
    console.log('❌ Le créneau dépasse minuit');
    toast({
      title: "Créneau non disponible",
      description: "Le créneau demandé dépasse minuit. Veuillez choisir un horaire plus tôt.",
      variant: "destructive",
    });
    return false;
  }

  // Vérifier les paramètres de réservation
  const { data: settingsData, error: settingsError } = await supabase
    .from('booking_settings')
    .select('*')
    .eq('key', 'booking_settings')
    .single();

  if (settingsError) {
    console.error('❌ Erreur lors de la récupération des paramètres:', settingsError);
    return false;
  }

  const settings = settingsData.value;
  const today = startOfDay(new Date());
  const minDate = settings.isTestMode ? today : addDays(today, settings.bookingWindow?.startDays || 1);

  // Vérifier le délai minimum de réservation
  if (date < minDate) {
    console.log('❌ Date trop proche');
    toast({
      title: "Date non disponible",
      description: `Les réservations doivent être faites au moins ${settings.bookingWindow?.startDays} jours à l'avance.`,
      variant: "destructive",
    });
    return false;
  }

  const dayOfWeek = date.getDay().toString();
  const daySettings = settings.openingHours?.[dayOfWeek];

  // Vérifier si le jour est ouvert
  if (!daySettings?.isOpen) {
    console.log('❌ Jour fermé');
    toast({
      title: "Jour non disponible",
      description: "Ce jour n'est pas ouvert aux réservations.",
      variant: "destructive",
    });
    return false;
  }

  // Vérifier si le créneau est dans les horaires d'ouverture
  const formattedTimeSlot = `${requestedStartTime}:00`;
  if (!daySettings.slots.includes(formattedTimeSlot)) {
    console.log('❌ Créneau hors horaires d\'ouverture');
    toast({
      title: "Créneau non disponible",
      description: "Ce créneau n'est pas disponible à la réservation.",
      variant: "destructive",
    });
    return false;
  }

  // Vérifier les réservations existantes
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('date', format(date, 'yyyy-MM-dd'))
    .neq('status', 'cancelled')
    .eq('payment_status', 'paid') // Ne prendre en compte que les réservations payées
    .is('deleted_at', null);

  if (error) {
    console.error('❌ Erreur lors de la vérification des disponibilités:', error);
    return false;
  }

  const hasOverlap = bookings?.some(booking => {
    const existingStartTime = parseInt(booking.time_slot);
    const existingDuration = parseInt(booking.duration);
    const existingEndTime = existingStartTime + existingDuration;

    const overlap = (
      (requestedStartTime >= existingStartTime && requestedStartTime < existingEndTime) ||
      (requestedEndTime > existingStartTime && requestedEndTime <= existingEndTime) ||
      (requestedStartTime <= existingStartTime && requestedEndTime >= existingEndTime)
    );

    if (overlap) {
      console.log('❌ Chevauchement détecté avec la réservation:', {
        existingBooking: {
          start: existingStartTime,
          end: existingEndTime,
          status: booking.status,
          paymentStatus: booking.payment_status
        },
        requestedBooking: {
          start: requestedStartTime,
          end: requestedEndTime
        }
      });
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

  console.log('✅ Créneau disponible');
  return true;
};