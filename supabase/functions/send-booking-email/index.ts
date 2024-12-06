import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { format } from "https://deno.land/x/date_fns@v2.22.1/format/index.js";
import { fr } from "https://deno.land/x/date_fns@v2.22.1/locale/index.js";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  to: string;
  userName: string;
  date: string;
  timeSlot: string;
  duration: string;
  groupSize: string;
  price: number;
  status: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: EmailData = await req.json();
    console.log("Received email data:", emailData);

    const formattedDate = format(new Date(emailData.date), "d MMMM yyyy", { locale: fr });
    const endTime = parseInt(emailData.timeSlot) + parseInt(emailData.duration);

    // Send email to customer
    const customerEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Karaoke Box Metz <no-reply@karaoke-box-metz.fr>",
        to: [emailData.to],
        subject: `Karaoke Box Metz - ${
          emailData.status === 'confirmed' ? 'Réservation confirmée' : 'Réservation reçue'
        }`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Confirmation de réservation - Karaoke Box Metz</title>
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
                  <h2>${emailData.status === 'confirmed' ? 'Réservation confirmée' : 'Réservation reçue'}</h2>
                </div>
                <p>Bonjour ${emailData.userName},</p>
                <p>${
                  emailData.status === 'confirmed'
                    ? 'Votre réservation a été confirmée.'
                    : 'Nous avons bien reçu votre réservation. Notre équipe la validera dans les plus brefs délais.'
                }</p>
                <div class="details">
                  <h3>Détails de votre réservation :</h3>
                  <p>📅 Date : ${formattedDate}</p>
                  <p>🕒 Horaire : ${emailData.timeSlot}h - ${endTime}h</p>
                  <p>👥 Nombre de personnes : ${emailData.groupSize}</p>
                  <p>💶 Prix total : ${emailData.price}€</p>
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
        `,
      }),
    });

    console.log("Customer email response:", await customerEmailRes.text());

    // Send notification to admin
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Karaoke Box Metz <no-reply@karaoke-box-metz.fr>",
        to: ["mendar.bouchali@gmail.com"],
        subject: "Nouvelle réservation - Karaoke Box Metz",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Nouvelle réservation - Karaoke Box Metz</title>
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
                  <h1>Nouvelle réservation reçue</h1>
                </div>
                <div class="details">
                  <h3>Détails de la réservation :</h3>
                  <p>👤 Client : ${emailData.userName}</p>
                  <p>📅 Date : ${formattedDate}</p>
                  <p>🕒 Horaire : ${emailData.timeSlot}h - ${endTime}h</p>
                  <p>👥 Nombre de personnes : ${emailData.groupSize}</p>
                  <p>💶 Prix total : ${emailData.price}€</p>
                  <p>📊 Statut : ${emailData.status}</p>
                </div>
                <div class="footer">
                  <p>Karaoke Box Metz - Panel Administrateur</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    console.log("Admin email response:", await adminEmailRes.text());

    if (customerEmailRes.ok && adminEmailRes.ok) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      throw new Error("Failed to send one or more emails");
    }
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);