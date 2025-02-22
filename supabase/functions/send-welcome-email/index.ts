import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
    const { to, fullName } = await req.json() as EmailRequest;
    console.log('📧 Envoi d\'email à:', { to, fullName });

    const client = new SmtpClient();

    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: "noreply@kbox.fr",
      password: "supabase",
    });

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C3AED;">Bienvenue ${fullName} !</h1>
        <p>Nous sommes ravis de vous accueillir sur K-Box.</p>
        <p>Votre compte a été créé avec succès. Vous pouvez dès maintenant réserver votre session de karaoké !</p>
        <p style="margin-top: 24px;">À très bientôt,</p>
        <p>L'équipe K-Box</p>
      </div>
    `;

    await client.send({
      from: "K-Box <noreply@kbox.fr>",
      to: to,
      subject: "Bienvenue sur K-Box !",
      html: html,
    });

    await client.close();
    
    console.log('✅ Email envoyé avec succès');

    return new Response(JSON.stringify({ success: true }), {
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