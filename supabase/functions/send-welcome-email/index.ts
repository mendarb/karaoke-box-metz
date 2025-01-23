import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  fullName: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('📧 Traitement d\'une nouvelle demande d\'email de bienvenue');

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error('❌ Clé API Resend manquante');
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { to, fullName } = await req.json() as EmailRequest;
    console.log('📧 Envoi d\'email à:', { to, fullName });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "K-Box <contact@reservation.karaoke-box-metz.fr>",
        to: [to],
        subject: "Bienvenue sur K-Box !",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7C3AED;">Bienvenue ${fullName} !</h1>
            <p>Nous sommes ravis de vous accueillir sur K-Box.</p>
            <p>Votre compte a été créé avec succès. Vous pouvez dès maintenant réserver votre session de karaoké !</p>
            <p style="margin-top: 24px;">À très bientôt,</p>
            <p>L'équipe K-Box</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('❌ Erreur Resend:', error);
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await res.json();
    console.log('✅ Email envoyé avec succès:', data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur dans la fonction send-welcome-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);