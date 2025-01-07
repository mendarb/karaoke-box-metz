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
  console.log("🚀 Welcome email function called");

  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Vérifier la clé API Resend
    if (!RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is missing");
      throw new Error("Configuration error: RESEND_API_KEY is not set");
    }

    // Récupérer et valider les données
    const { to, fullName } = await req.json() as EmailRequest;
    console.log("📧 Processing welcome email request:", { to, fullName });

    if (!to || !fullName) {
      console.error("❌ Missing required fields:", { to, fullName });
      throw new Error("Missing required fields: to and fullName are required");
    }

    // Préparer le contenu de l'email
    const emailContent = {
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
    };

    console.log("📨 Sending email with Resend...");
    
    // Envoyer l'email
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailContent),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("❌ Resend API error:", {
        status: res.status,
        statusText: res.statusText,
        data
      });
      
      throw new Error(data.message || "Failed to send email");
    }

    console.log("✅ Welcome email sent successfully:", data);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Welcome email sent successfully",
      data 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("❌ Error in send-welcome-email function:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Déterminer le code d'état approprié
    let statusCode = 500;
    if (error.message.includes("Missing required fields")) {
      statusCode = 400;
    } else if (error.message.includes("Configuration error")) {
      statusCode = 503;
    }

    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Internal server error",
      details: error.toString()
    }), {
      status: statusCode,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);