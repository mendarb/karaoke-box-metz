import { supabase } from "@/lib/supabase";
import { createCheckoutSession } from "@/services/checkoutService";

export const createBooking = async (data: any, userId: string | null) => {
  console.log('📝 Début de création de réservation:', {
    userId,
    email: data.email,
    date: data.date,
    timeSlot: data.timeSlot,
    duration: data.duration,
    groupSize: data.groupSize,
    price: data.calculatedPrice,
    isTestMode: data.isTestMode
  });

  const bookingData = {
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
    is_test_booking: data.isTestMode,
  };

  console.log('🔄 Tentative d\'insertion de la réservation:', bookingData);

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
  console.log('💰 Début de génération du lien de paiement:', {
    bookingId: data.bookingId,
    email: data.email,
    price: data.calculatedPrice,
    isTestMode: data.isTestMode
  });

  try {
    const response = await supabase.functions.invoke('create-checkout', {
      body: {
        bookingId: data.bookingId,
        userId: data.userId,
        userEmail: data.email,
        date: data.date,
        timeSlot: data.timeSlot,
        duration: data.duration,
        groupSize: data.groupSize,
        price: data.calculatedPrice,
        userName: data.fullName,
        userPhone: data.phone,
        isTestMode: data.isTestMode,
        message: data.message
      },
    });

    if (response.error) {
      console.error('❌ Erreur lors de la création de la session de paiement:', response.error);
      throw new Error(response.error.message || 'Échec de création de la session de paiement');
    }

    const { url } = response.data;
    
    if (!url) {
      console.error('❌ Pas d\'URL de paiement retournée');
      throw new Error('Pas d\'URL de paiement retournée');
    }

    console.log('✅ Lien de paiement généré avec succès:', {
      url,
      bookingId: data.bookingId,
      isTestMode: data.isTestMode
    });

    return url;
  } catch (error: any) {
    console.error('❌ Erreur lors de la génération du lien de paiement:', error);
    throw error;
  }
};