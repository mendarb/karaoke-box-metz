import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { format } from "https://esm.sh/date-fns@2.30.0";
import { fr } from "https://esm.sh/date-fns@2.30.0/locale";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking } = await req.json();
    
    console.log('📧 Préparation de l\'email de demande de paiement:', {
      email: booking.userEmail,
      date: booking.date,
      price: booking.price,
      paymentUrl: booking.paymentUrl
    });

    if (!booking.userEmail || !booking.date || !booking.paymentUrl) {
      throw new Error('Données de réservation manquantes');
    }

    const bookingDate = new Date(booking.date);
    const formattedDate = format(bookingDate, 'EEEE d MMMM yyyy', { locale: fr });
    const startHour = parseInt(booking.timeSlot);
    const endHour = startHour + parseInt(booking.duration);
    const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7E3AED; margin: 0;">Confirmez votre réservation</h1>
          <p style="color: #6B7280; margin-top: 10px;">Un dernier pas avant de chanter !</p>
        </div>
        
        <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #374151; margin-top: 0;">Détails de votre réservation</h2>
          <p style="margin: 10px 0;"><strong>📅 Date :</strong> ${formattedDate}</p>
          <p style="margin: 10px 0;"><strong>⏰ Horaire :</strong> ${formatHour(startHour)} - ${formatHour(endHour)}</p>
          <p style="margin: 10px 0;"><strong>⌛️ Durée :</strong> ${booking.duration}h</p>
          <p style="margin: 10px 0;"><strong>👥 Participants :</strong> ${booking.groupSize} personne(s)</p>
          <p style="margin: 10px 0;"><strong>💰 Prix total :</strong> ${booking.price}€ ${booking.promoCode ? `<span style="color: #10B981;">(Code promo ${booking.promoCode} appliqué)</span>` : ''}</p>
          ${booking.message ? `<p style="margin: 10px 0;"><strong>💬 Message :</strong> ${booking.message}</p>` : ''}
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${booking.paymentUrl}" 
             style="background-color: #7E3AED; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
            Payer maintenant
          </a>
          <p style="color: #EF4444; margin-top: 15px; font-size: 14px;">
            ⚠️ Ce lien de paiement expire dans 24 heures
          </p>
        </div>

        <div style="background-color: #7E3AED; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: white;">📍 Où nous trouver</h3>
          <p style="margin-bottom: 5px;">12 Rue des Huiliers</p>
          <p style="margin-top: 0;">57000 Metz</p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #6B7280;">
          <p style="margin-bottom: 5px;">Besoin d'aide ?</p>
          <p style="margin: 5px 0;">
            <a href="tel:+33782492402" style="color: #7E3AED; text-decoration: none;">07 82 49 24 02</a>
          </p>
          <p style="margin: 5px 0;">
            <a href="mailto:contact@karaoke-box-metz.fr" style="color: #7E3AED; text-decoration: none;">contact@karaoke-box-metz.fr</a>
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 20px;">
          <p style="color: #6B7280; font-size: 14px;">Suivez-nous sur les réseaux sociaux</p>
          <div style="margin-top: 10px;">
            <a href="https://www.instagram.com/karaokeboxmetz/" style="color: #7E3AED; margin: 0 10px; text-decoration: none;">Instagram</a>
            <a href="https://www.facebook.com/people/Karaoké-BOX-Metz/61571072424332/" style="color: #7E3AED; margin: 0 10px; text-decoration: none;">Facebook</a>
          </div>
        </div>
      </div>
    `;

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('Clé API Resend non configurée');
    }

    console.log('📧 Envoi de l\'email via Resend...');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Karaoké Box <onboarding@resend.dev>', // Utilisation temporaire de l'adresse par défaut
        to: [booking.userEmail],
        subject: '🎤 Confirmez votre réservation - K-Box',
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Erreur Resend:', errorText);
      throw new Error(`Erreur lors de l'envoi de l'email: ${errorText}`);
    }

    const data = await res.json();
    console.log('✅ Email envoyé avec succès:', data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erreur dans la fonction send-payment-request:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});