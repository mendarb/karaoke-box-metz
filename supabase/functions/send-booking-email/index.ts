import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not configured');
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { booking, type = 'confirmation' } = await req.json();
    console.log('📧 Processing email request:', { 
      bookingId: booking.id, 
      type,
      userEmail: booking.user_email,
      userName: booking.user_name
    });

    // Format the date and time
    const startHour = parseInt(booking.time_slot);
    const endHour = startHour + parseInt(booking.duration);
    const date = new Date(booking.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Construct the email content
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
              <h2>Réservation ${type === 'confirmation' ? 'confirmée' : 'en attente'}</h2>
            </div>
            <p>Bonjour ${booking.user_name},</p>
            <p>${
              type === 'confirmation' 
                ? 'Votre réservation a été confirmée !' 
                : 'Nous avons bien reçu votre demande de réservation.'
            }</p>
            <div class="details">
              <h3>Détails de la réservation :</h3>
              <p>📅 Date : ${formattedDate}</p>
              <p>⏰ Horaire : ${startHour}h - ${endHour}h</p>
              <p>👥 Nombre de personnes : ${booking.group_size}</p>
              <p>💶 Prix total : ${booking.price}€</p>
            </div>
            <div class="footer">
              <p>À bientôt !</p>
              <p>L'équipe Lovable Karaoké</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Lovable Karaoké <reservation@lovablekaraoke.fr>',
        to: booking.user_email,
        subject: `Réservation ${type === 'confirmation' ? 'confirmée' : 'en attente'} - Lovable Karaoké`,
        html: emailContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to send email:', error);
      throw new Error('Failed to send email');
    }

    console.log('✅ Email sent successfully');
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error processing email request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});