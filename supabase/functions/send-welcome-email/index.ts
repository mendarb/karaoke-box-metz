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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, fullName } = await req.json() as EmailRequest;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "K-Box <no-reply@k-box.fr>",
        to: [to],
        subject: "Bienvenue sur K-Box !",
        html: `
          <h1>Bienvenue ${fullName} !</h1>
          <p>Nous sommes ravis de vous accueillir sur K-Box.</p>
          <p>Votre compte a été créé avec succès. Vous pouvez dès maintenant réserver votre session de karaoké !</p>
          <p>À très bientôt,</p>
          <p>L'équipe K-Box</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Erreur lors de l'envoi de l'email:", error);
      throw new Error(error);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur dans la fonction send-welcome-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);