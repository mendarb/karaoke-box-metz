import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const handleCheckoutSession = async (
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createClient>
) => {
  console.log('💳 Traitement de la session de paiement:', {
    sessionId: session.id,
    metadata: session.metadata,
    paymentStatus: session.payment_status,
    livemode: session.livemode,
    customerEmail: session.customer_details?.email,
    customerName: session.customer_details?.name
  });

  try {
    if (session.payment_status !== "paid") {
      console.log("❌ Paiement non complété:", session.payment_status);
      return { received: true, status: "pending" };
    }

    // Ensure we have the customer email
    const userEmail = session.metadata?.userEmail || session.customer_details?.email;
    const userName = session.metadata?.userName || session.customer_details?.name;
    
    if (!userEmail) {
      throw new Error('Email utilisateur manquant');
    }

    // Créer la réservation uniquement après un paiement réussi
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id: session.metadata?.userId,
        user_email: userEmail,
        user_name: userName || 'Client',
        user_phone: session.metadata?.userPhone || '',
        date: session.metadata?.date,
        time_slot: session.metadata?.timeSlot,
        duration: session.metadata?.duration,
        group_size: session.metadata?.groupSize,
        price: parseFloat(session.metadata?.price || '0'),
        message: session.metadata?.message,
        status: 'confirmed',
        payment_status: 'paid',
        is_test_booking: session.metadata?.isTestMode === 'true',
        payment_intent_id: session.payment_intent as string,
        promo_code_id: session.metadata?.promoCodeId || null,
        cabin: 'metz'
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Erreur lors de la création de la réservation:', bookingError);
      throw bookingError;
    }

    console.log('✅ Réservation créée:', {
      id: booking.id,
      status: booking.status,
      paymentStatus: booking.payment_status,
      userEmail: booking.user_email
    });

    // Récupérer l'URL du reçu
    let receiptUrl = null;
    try {
      const stripeKey = session.livemode 
        ? Deno.env.get('STRIPE_SECRET_KEY')
        : Deno.env.get('STRIPE_TEST_SECRET_KEY');

      if (!stripeKey) {
        throw new Error(`Clé API Stripe ${session.livemode ? 'live' : 'test'} non configurée`);
      }

      const stripe = new Stripe(stripeKey, {
        apiVersion: '2023-10-16',
      });

      const paymentIntentId = session.payment_intent as string;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.latest_charge) {
        const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);
        receiptUrl = charge.receipt_url;
        console.log('🧾 URL du reçu récupérée:', receiptUrl);

        // Mettre à jour la réservation avec l'URL du reçu
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ invoice_url: receiptUrl })
          .eq('id', booking.id);

        if (updateError) {
          console.error('⚠️ Erreur lors de la mise à jour de l\'URL du reçu:', updateError);
        }
      }
    } catch (receiptError) {
      console.error('⚠️ Erreur lors de la récupération du reçu:', receiptError);
    }

    // Envoyer l'email de confirmation
    try {
      const emailResponse = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          },
          body: JSON.stringify({ booking }),
        }
      );

      if (!emailResponse.ok) {
        throw new Error(await emailResponse.text());
      }

      console.log('📧 Email de confirmation envoyé');
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
    }

    return { received: true, booking };
  } catch (error) {
    console.error('❌ Erreur lors du traitement de la session de paiement:', error);
    throw error;
  }
};