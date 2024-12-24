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

  // Get the current session to verify authentication status
  const { data: { session } } = await supabase.auth.getSession();
  const authenticatedUserId = session?.user?.id;

  // Only set user_id if we have an authenticated user
  const bookingData = {
    user_id: authenticatedUserId || null, // Only set if user is authenticated
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
  };

  console.log('Creating booking with data:', bookingData);

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();

  if (error) {
    console.error('❌ Erreur lors de la création de la réservation:', error);
    throw error;
  }

  console.log('✅ Réservation créée avec succès:', {
    bookingId: booking.id,
    status: booking.status,
    paymentStatus: booking.payment_status,
    userId: booking.user_id
  });

  return booking;
};

export const generatePaymentLink = async (data: any) => {
  console.log('💰 Génération du lien de paiement pour la réservation:', data.bookingId);

  const checkoutUrl = await createCheckoutSession({
    bookingId: data.bookingId,
    userId: data.userId,
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
    promoCodeId: data.promoCodeId,
    promoCode: data.promoCode,
    discountAmount: data.discountAmount,
  });

  console.log('✅ Lien de paiement généré:', {
    url: checkoutUrl,
    bookingId: data.bookingId,
    isTestMode: data.isTestMode
  });
  return checkoutUrl;
};