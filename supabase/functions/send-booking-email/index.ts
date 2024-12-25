import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { format } from "https://esm.sh/date-fns@2.30.0";
import { fr } from "https://esm.sh/date-fns@2.30.0/locale";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking } = await req.json();
    console.log('📧 Sending booking email:', booking);

    if (!booking || !booking.date || !booking.time_slot) {
      throw new Error('Missing required booking data');
    }

    // Formatage précis de la date et de l'heure
    const bookingDate = new Date(booking.date);
    const formattedDate = format(bookingDate, 'EEEE d MMMM yyyy', { locale: fr });
    const startHour = parseInt(booking.time_slot);
    const endHour = startHour + parseInt(booking.duration);
    const timeSlot = `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;

    const emailContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Votre réservation est confirmée !</h1>
        
        <p>Bonjour ${booking.user_name},</p>
        
        <p>Nous avons le plaisir de vous confirmer votre réservation :</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date :</strong> ${formattedDate}</p>
          <p><strong>Horaire :</strong> ${timeSlot}</p>
          <p><strong>Durée :</strong> ${booking.duration} heure(s)</p>
          <p><strong>Nombre de participants :</strong> ${booking.group_size} personne(s)</p>
          ${booking.is_test_booking ? '<p style="color: #EAB308;"><strong>Ceci est une réservation de test</strong></p>' : ''}
        </div>
        
        <h2 style="color: #4F46E5;">Informations importantes</h2>
        
        <ul>
          <li>Merci d'arriver 15 minutes avant l'heure de votre réservation</li>
          <li>L'adresse exacte vous sera communiquée par SMS le jour de votre venue</li>
          <li>En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance</li>
        </ul>
        
        <p>Pour toute question, n'hésitez pas à nous contacter :</p>
        <p>📞 <a href="tel:+33612345678">06 12 34 56 78</a></p>
        
        <p style="margin-top: 40px;">À très bientôt !</p>
        <p>L'équipe Karaoke Box Metz</p>
      </div>
    `;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('Missing Resend API key');
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Resend <onboarding@resend.dev>',
        to: booking.user_email,
        subject: 'Réservation confirmée - Karaoke Box Metz',
        html: emailContent,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('❌ Resend API error:', error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log('✅ Email sent successfully:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Error in send-booking-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});