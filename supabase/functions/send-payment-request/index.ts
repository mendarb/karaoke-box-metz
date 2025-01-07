import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { format } from "https://esm.sh/date-fns@2.30.0";
import { fr } from "https://esm.sh/date-fns@2.30.0/locale";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequestEmailData {
  userEmail: string;
  userName: string;
  date: string;
  timeSlot: string;
  duration: string;
  groupSize: string;
  price: number;
  paymentUrl: string;
  message?: string;
  promoCode?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking } = await req.json();
    console.log('📧 Envoi de l\'email de demande de paiement:', {
      email: booking.userEmail,
      date: booking.date,
      price: booking.price
    });

    const bookingDate = new Date(booking.date);
    const formattedDate = format(bookingDate, 'EEEE d MMMM yyyy', { locale: fr });
    const startHour = parseInt(booking.timeSlot);
    const endHour = startHour + parseInt(booking.duration);
    const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7E3AED;">Votre réservation est en attente de paiement</h1>
        
        <p>Bonjour ${booking.userName},</p>
        
        <p>Nous avons bien reçu votre demande de réservation au Karaoké Box. Pour la confirmer, veuillez procéder au paiement en cliquant sur le lien ci-dessous :</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>📅 Date :</strong> ${formattedDate}</p>
          <p><strong>⏰ Horaire :</strong> ${formatHour(startHour)} - ${formatHour(endHour)}</p>
          <p><strong>⌛️ Durée :</strong> ${booking.duration}h</p>
          <p><strong>👥 Nombre de participants :</strong> ${booking.groupSize} personne(s)</p>
          <p><strong>💰 Prix :</strong> ${booking.price}€${booking.promoCode ? ` (Code promo ${booking.promoCode} appliqué)` : ''}</p>
          ${booking.message ? `<p><strong>💬 Message :</strong> ${booking.message}</p>` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${booking.paymentUrl}" style="background-color: #7E3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Payer maintenant
          </a>
        </div>
        
        <p style="color: #EF4444; font-weight: 500;">⚠️ Important : Ce lien de paiement est valable pendant 24 heures. Passé ce délai, votre réservation sera automatiquement annulée.</p>
        
        <div style="background-color: #7E3AED; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: white; margin-top: 0;">📍 Adresse</h2>
          <p style="margin-bottom: 0;">12 Rue des Huiliers, 57000 Metz</p>
        </div>
        
        <div style="margin-top: 40px;">
          <p><strong>Une question ?</strong></p>
          <p>📞 <a href="tel:+33782492402" style="color: #7E3AED;">07 82 49 24 02</a></p>
          <p>📧 <a href="mailto:contact@karaoke-box-metz.fr" style="color: #7E3AED;">contact@karaoke-box-metz.fr</a></p>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
          <p>Suivez-nous sur les réseaux sociaux :</p>
          <p>
            <a href="https://www.instagram.com/karaokeboxmetz/" style="color: #7E3AED; margin: 0 10px;">Instagram</a>
            <a href="https://www.facebook.com/people/Karaoké-BOX-Metz/61571072424332/" style="color: #7E3AED; margin: 0 10px;">Facebook</a>
          </p>
        </div>
        
        <p style="margin-top: 40px;">À très bientôt !</p>
        <p>L'équipe Karaoke Box Metz</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: "K-Box <reservation@k-box.fr>",
        to: [booking.userEmail],
        subject: "Votre réservation est en attente de paiement - K-Box",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      throw new Error(`Erreur lors de l'envoi de l'email: ${await res.text()}`);
    }

    console.log('✅ Email de demande de paiement envoyé avec succès');
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});