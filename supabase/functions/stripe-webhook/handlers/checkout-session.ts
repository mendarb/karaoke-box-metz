import { stripe } from '../_lib/stripe';
import { supabase } from '../_lib/supabase';
import { sendBookingConfirmationEmail } from '../services/email-service';
import { updateBookingStatus } from '../services/booking-service';
import { trackEvent } from '../_lib/analytics';

export const handleCheckoutSession = async (session: any) => {
  console.log('💳 Processing checkout session:', session.id);
  
  try {
    // Récupérer les métadonnées de la session
    const { metadata } = session;
    if (!metadata?.bookingId) {
      throw new Error('No booking ID in session metadata');
    }

    // Mettre à jour le statut de la réservation
    await updateBookingStatus(metadata.bookingId, 'confirmed', session.payment_intent);

    // Envoyer l'email de confirmation
    await sendBookingConfirmationEmail(metadata.bookingId);

    // Tracker l'événement de paiement réussi
    trackEvent('purchase', {
      transaction_id: session.payment_intent,
      currency: session.currency.toUpperCase(),
      value: session.amount_total / 100,
      items: [{
        item_name: `Réservation - ${metadata.bookingId}`,
        price: session.amount_total / 100,
        quantity: 1
      }]
    });

    console.log('✅ Checkout session processed successfully');
    
  } catch (error) {
    console.error('❌ Error processing checkout session:', error);
    throw error;
  }
};