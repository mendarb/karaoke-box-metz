import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

    const emailHtml = `
      <h1>Confirmation de votre réservation</h1>
      <p>Bonjour ${booking.userName},</p>
      <p>Votre réservation est en attente de paiement. Voici le récapitulatif :</p>
      <ul>
        <li>Date : ${booking.date}</li>
        <li>Heure : ${booking.timeSlot}h</li>
        <li>Durée : ${booking.duration}h</li>
        <li>Nombre de personnes : ${booking.groupSize}</li>
        <li>Prix total : ${booking.price}€</li>
      </ul>
      <p>Pour finaliser votre réservation, veuillez procéder au paiement en cliquant sur le lien ci-dessous :</p>
      <p><a href="${booking.paymentUrl}">Payer maintenant</a></p>
      <p>Ce lien est valable pendant 24 heures. Passé ce délai, votre réservation sera automatiquement annulée.</p>
      <p>À bientôt !</p>
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
        subject: "Confirmation de votre réservation - K-Box",
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