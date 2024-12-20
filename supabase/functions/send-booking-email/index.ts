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
    console.log('📧 Processing email request:', { bookingId: booking.id, type });

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
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Réservation ${type === 'confirmation' ? 'confirmée' : 'en attente'}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { background-color: #f9f9f9; padding: 20px; border-radius: 8px; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Karaoké BOX</h1>
              <h2>Réservation ${type === 'confirmation' ? 'confirmée' : 'en attente'}</h2>
            </div>
            <p>Bonjour ${booking.user_name},</p>
            ${type === 'confirmation' ? `
              <p>Votre réservation a été confirmée avec succès ! Voici les détails :</p>
              <div class="details">
                <p>📅 Date : ${formattedDate}</p>
                <p>🕒 Horaire : ${startHour}h00 - ${endHour}h00</p>
                <p>👥 Nombre de personnes : ${booking.group_size}</p>
                <p>💶 Prix total : ${booking.price}€</p>
              </div>
              <p>Nous avons hâte de vous accueillir !</p>
            ` : `
              <p>Votre réservation est en attente de paiement.</p>
              <p>N'hésitez pas à effectuer une nouvelle réservation sur notre site.</p>
            `}
            <div class="footer">
              <p>Karaoké BOX<br>
              📍 [Adresse]<br>
              📞 [Téléphone]<br>
              ✉️ contact@karaoke-box.fr</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('📤 Sending email to:', booking.user_email);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Karaoké BOX <onboarding@resend.dev>',
        to: [booking.user_email],
        subject: `Réservation ${type === 'confirmation' ? 'confirmée' : 'en attente'} - Karaoké BOX`,
        html: emailContent,
      }),
    });

    const result = await response.json();
    console.log('✅ Email sent successfully:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: response.ok ? 200 : 400,
    });

  } catch (error) {
    console.error('❌ Error in email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});