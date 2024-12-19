import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  booking: {
    id: string;
    user_name: string;
    user_email: string;
    date: string;
    time_slot: string;
    duration: string;
    group_size: string;
    price: number;
    status: string;
    payment_status: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log('📧 Starting email handler');

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { booking }: BookingEmailRequest = await req.json();
    console.log('📦 Received booking data:', booking);

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get email templates from settings
    const { data: settings, error: settingsError } = await supabase
      .from('booking_settings')
      .select('*')
      .eq('key', 'email_templates')
      .single();

    if (settingsError) {
      console.error('❌ Error fetching email templates:', settingsError);
      throw settingsError;
    }

    const templates = settings.value.confirmation;
    const isPaid = booking.payment_status === 'paid';
    
    // Format date
    const date = new Date(booking.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const endTime = parseInt(booking.time_slot) + parseInt(booking.duration);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${isPaid ? templates.paid : templates.pending}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { background-color: #f9f9f9; padding: 20px; border-radius: 8px; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Karaoke Box Metz</h1>
              <h2>${isPaid ? templates.paid : templates.pending}</h2>
            </div>
            <p>Bonjour ${booking.user_name},</p>
            <div class="details">
              <p>📅 Date : ${formattedDate}</p>
              <p>🕒 Horaire : ${booking.time_slot}h - ${endTime}h</p>
              <p>👥 Nombre de personnes : ${booking.group_size}</p>
              <p>💶 Prix total : ${booking.price}€</p>
              <p>💳 Statut du paiement : ${isPaid ? 'Payé' : 'En attente de paiement'}</p>
            </div>
            <div class="footer">
              <p>Karaoke Box Metz<br>
              📍 [Adresse]<br>
              📞 [Téléphone]<br>
              ✉️ contact@karaoke-box-metz.fr</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('📤 Sending email to:', booking.user_email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Karaoke Box Metz <onboarding@resend.dev>",
        to: [booking.user_email],
        subject: isPaid ? "Votre réservation est confirmée !" : "Confirmation de votre réservation",
        html: emailHtml,
      }),
    });

    const data = await res.json();
    console.log('✅ Email sent:', data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error('❌ Error in send-booking-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);