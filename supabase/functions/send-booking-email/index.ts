import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking, type } = await req.json();
    console.log('📧 Sending email for booking:', { bookingId: booking.id, type });

    const startHour = parseInt(booking.time_slot);
    const endHour = startHour + parseInt(booking.duration);
    const date = new Date(booking.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailContent = `
      <h1>Réservation ${type === 'confirmation' ? 'confirmée' : 'en attente'}</h1>
      <p>Bonjour ${booking.user_name},</p>
      <p>${type === 'confirmation' 
        ? 'Votre réservation a été confirmée.' 
        : 'Votre réservation est en attente de paiement.'}</p>
      <h2>Détails de la réservation :</h2>
      <ul>
        <li>Date : ${formattedDate}</li>
        <li>Horaire : ${startHour}h00 - ${endHour}h00</li>
        <li>Durée : ${booking.duration}h</li>
        <li>Nombre de personnes : ${booking.group_size}</li>
        <li>Prix : ${booking.price}€</li>
      </ul>
      ${booking.is_test_booking ? '<p><em>Ceci est une réservation de test.</em></p>' : ''}
      <p>À bientôt !</p>
    `;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }

    console.log('Sending email with content:', emailContent);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Karaoké BOX <reservation@karaoke-box.fr>',
        to: booking.user_email,
        subject: `Réservation ${type === 'confirmation' ? 'confirmée' : 'en attente'} - Karaoké BOX`,
        html: emailContent,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const result = await response.json();
    console.log('✅ Email sent successfully:', result);

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error in email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});