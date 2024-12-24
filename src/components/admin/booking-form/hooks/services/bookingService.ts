import { supabase } from "@/lib/supabase";
import { createCheckoutSession } from "@/services/checkoutService";

export const createBooking = async (data: any, userId: string | null) => {
  console.log('📝 Création d\'une nouvelle réservation :', {
    userId,
    email: data.email,
    date: data.date,
    timeSlot: data.timeSlot,
    duration: data.duration,
    groupSize: data.groupSize,
    price: data.calculatedPrice
  });

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([{
      user_id: userId,
      user_email: data.email,
      user_name: data.fullName,
      user_phone: data.phone,
      date: data.date,
      time_slot: data.timeSlot,
      duration: data.duration,
      group_size: data.groupSize,
      price: data.calculatedPrice,
      message: data.message,
      status: 'pending',
      payment_status: 'awaiting_payment',
      is_test_booking: data.isTestMode || false,
    }])
    .select()
    .single();

  if (error) {
    console.error('❌ Erreur lors de la création de la réservation:', error);
    throw error;
  }

  console.log('✅ Réservation créée avec succès:', {
    bookingId: booking.id,
    status: booking.status,
    paymentStatus: booking.payment_status
  });

  return booking;
};

export const generatePaymentLink = async (booking: any, data: any) => {
  console.log('💰 Génération du lien de paiement pour la réservation:', booking.id);

  const checkoutUrl = await createCheckoutSession({
    bookingId: booking.id,
    userId: booking.user_id,
    userEmail: data.email,
    date: data.date,
    timeSlot: data.timeSlot,
    duration: data.duration,
    groupSize: data.groupSize,
    price: data.price || data.calculatedPrice,
    finalPrice: data.finalPrice || data.calculatedPrice,
    message: data.message,
    userName: data.fullName,
    userPhone: data.phone,
    isTestMode: data.isTestMode || false,
  });

  console.log('✅ Lien de paiement généré:', checkoutUrl);
  return checkoutUrl;
};