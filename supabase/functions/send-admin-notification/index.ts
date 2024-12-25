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
    console.log('📧 Sending admin notification for booking:', booking);

    if (!booking || !booking.date || !booking.time_slot) {
      throw new Error('Missing required booking data');
    }

    const bookingDate = new Date(booking.date);
    const formattedDate = format(bookingDate, 'EEEE d MMMM yyyy', { locale: fr });
    const startHour = booking.time_slot.padStart(5, '0');
    const endHour = `${(parseInt(booking.time_slot) + parseInt(booking.duration)).toString().padStart(2, '0')}:00`;

    console.log('🕒 Formatted time:', {
      original: booking.time_slot,
      start: startHour,
      end: endHour,
      duration: booking.duration
    });

    const emailContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Nouvelle réservation !</h1>
        
        <p>Une nouvelle réservation vient d'être effectuée :</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Client :</strong> ${booking.user_name}</p>
          <p><strong>Email :</strong> ${booking.user_email}</p>
          <p><strong>Téléphone :</strong> ${booking.user_phone}</p>
          <p><strong>Date :</strong> ${formattedDate}</p>
          <p><strong>Horaire :</strong> ${startHour} - ${endHour}</p>
          <p><strong>Durée :</strong> ${booking.duration} heure(s)</p>
          <p><strong>Nombre de participants :</strong> ${booking.group_size} personne(s)</p>
          <p><strong>Prix :</strong> ${booking.price}€</p>
          ${booking.message ? `<p><strong>Message :</strong> ${booking.message}</p>` : ''}
          ${booking.is_test_booking ? '<p style="color: #EAB308;"><strong>Ceci est une réservation de test</strong></p>' : ''}
        </div>
        
        <p>Vous pouvez consulter les détails dans le tableau de bord administrateur.</p>
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
        from: 'Karaoke Box <onboarding@resend.dev>',
        to: ['contact@karaoke-box-metz.fr'],
        subject: 'Nouvelle réservation - Karaoke Box Metz',
        html: emailContent,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('❌ Resend API error:', error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log('✅ Admin notification sent successfully:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Error in send-admin-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});