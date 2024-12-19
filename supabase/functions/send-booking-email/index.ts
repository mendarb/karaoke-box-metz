import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/@resend/node@0.16.0";

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

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const startHour = parseInt(booking.time_slot);
    const endHour = startHour + parseInt(booking.duration);

    const emailContent = `
      <h1>Réservation ${type === 'confirmation' ? 'confirmée' : 'en attente'}</h1>
      <p>Bonjour ${booking.user_name},</p>
      <p>${type === 'confirmation' 
        ? 'Votre réservation a été confirmée.' 
        : 'Votre réservation est en attente de paiement.'}</p>
      <h2>Détails de la réservation :</h2>
      <ul>
        <li>Date : ${new Date(booking.date).toLocaleDateString('fr-FR')}</li>
        <li>Horaire : ${startHour}h00 - ${endHour}h00</li>
        <li>Durée : ${booking.duration}h</li>
        <li>Nombre de personnes : ${booking.group_size}</li>
        <li>Prix : ${booking.price}€</li>
      </ul>
      ${booking.is_test_booking ? '<p><em>Ceci est une réservation de test.</em></p>' : ''}
      <p>À bientôt !</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Karaoké BOX <reservation@karaoke-box.fr>',
      to: booking.user_email,
      subject: `Réservation ${type === 'confirmation' ? 'confirmée' : 'en attente'} - Karaoké BOX`,
      html: emailContent,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }

    console.log('✅ Email sent successfully:', data);

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