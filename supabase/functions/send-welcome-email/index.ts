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
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { to, fullName } = await req.json() as EmailRequest;
    console.log('📧 Sending welcome email to:', { to, fullName });

    if (!to || !fullName) {
      throw new Error("Missing required fields: to and fullName are required");
    }

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

    const data = await res.json();
    
    if (!res.ok) {
      console.error('❌ Resend API error:', data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log('✅ Welcome email sent successfully:', data);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error",
        details: error.toString()
      }),
      {
        status: error.status || 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);