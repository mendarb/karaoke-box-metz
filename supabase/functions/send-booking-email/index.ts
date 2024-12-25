import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { format } from "https://esm.sh/date-fns@2.30.0";
import { fr } from "https://esm.sh/date-fns@2.30.0/locale";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not configured');
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { booking } = await req.json();
    
    if (!booking || !booking.user_email || !booking.date || !booking.time_slot) {
      console.error('❌ Missing required booking data:', booking);
      throw new Error('Données de réservation manquantes');
    }

    console.log('📧 Processing email request:', {
      bookingId: booking.id,
      email: booking.user_email,
      date: booking.date,
      timeSlot: booking.time_slot
    });

    const formattedDate = format(new Date(booking.date), "EEEE d MMMM yyyy", { locale: fr });
    const startHour = parseInt(booking.time_slot);
    const endHour = startHour + parseInt(booking.duration);

    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Réservation confirmée !</h2>
            </div>
            <p>Bonjour ${booking.user_name},</p>
            <p>Votre réservation a été confirmée !</p>
            <div class="details">
              <h3>Détails de la réservation :</h3>
              <p>📅 Date : ${formattedDate}</p>
              <p>⏰ Horaire : ${startHour}h - ${endHour}h</p>
              <p>👥 Nombre de personnes : ${booking.group_size} personne(s)</p>
              <p>💶 Prix total : ${booking.price}€</p>
              ${booking.is_test_booking ? '<p>⚠️ Ceci est une réservation de test</p>' : ''}
            </div>
            <div class="footer">
              <p>À bientôt !</p>
              <p>L'équipe Karaoke Box Metz</p>
              <p>📍 12 Rue des Huiliers, 57000 Metz</p>
              <p>📞 07 82 49 24 02</p>
              <p>✉️ contact@karaoke-box-metz.fr</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Karaoke Box Metz <contact@karaoke-box-metz.fr>',
        to: booking.user_email,
        subject: 'Réservation confirmée - Karaoke Box Metz',
        html: emailContent,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to send email:', error);
      throw new Error(error);
    }

    const data = await response.json();
    console.log('✅ Email sent successfully:', data);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in send-booking-email:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});