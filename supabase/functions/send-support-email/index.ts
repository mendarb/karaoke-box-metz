import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('❌ Missing RESEND_API_KEY');
      throw new Error('Missing RESEND_API_KEY');
    }

    // Parse and validate request body
    const { name, email, message } = await req.json();
    
    if (!name || !email || !message) {
      console.error('❌ Missing required fields:', { name, email, message });
      throw new Error('Missing required fields');
    }

    console.log('📧 Sending support email from:', { name, email });

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Karaoke Box Support <onboarding@resend.dev>",
        to: ["contact@karaoke-box-metz.fr"],
        subject: `Nouveau message de support de ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Nouveau message de support</h2>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
        reply_to: email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('❌ Error from Resend API:', data);
      throw new Error(JSON.stringify(data));
    }

    console.log('✅ Support email sent successfully:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error sending support email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send support email' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});