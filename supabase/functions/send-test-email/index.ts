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
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }

    console.log('📧 Envoi d\'un email de test');

    const emailContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7E3AED;">Test d'envoi d'email - Karaoke Box</h1>
        
        <p>Bonjour,</p>
        
        <p>Ceci est un email de test pour vérifier la configuration de Resend.</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>✅ Si vous recevez cet email, cela signifie que la configuration fonctionne correctement.</p>
        </div>
        
        <p>Cordialement,</p>
        <p>L'équipe Karaoke Box</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Karaoke Box <onboarding@resend.dev>',
        to: ['mendar.bouchali@gmail.com'],
        subject: 'Test Email - Karaoke Box',
        html: emailContent,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('❌ Erreur Resend API:', error);
      throw new Error(`Échec de l'envoi de l'email: ${error}`);
    }

    const data = await res.json();
    console.log('✅ Email envoyé avec succès:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('❌ Erreur dans la fonction send-test-email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});