import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

interface Booking {
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
}

export const sendConfirmationEmail = async (booking: Booking, supabase: ReturnType<typeof createClient>) => {
  try {
    console.log('📧 Sending confirmation email for booking:', booking.id);
    
    const isPaid = booking.payment_status === 'paid';
    const subject = isPaid 
      ? "Votre réservation est confirmée !"
      : "Votre réservation a été annulée";

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
          <title>${subject}</title>
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
              <h2>${subject}</h2>
            </div>
            <p>Bonjour ${booking.user_name},</p>
            ${isPaid ? `
              <p>Votre réservation a été confirmée avec succès ! Voici les détails :</p>
              <div class="details">
                <p>📅 Date : ${formattedDate}</p>
                <p>🕒 Horaire : ${booking.time_slot}h - ${endTime}h</p>
                <p>👥 Nombre de personnes : ${booking.group_size}</p>
                <p>💶 Prix total : ${booking.price}€</p>
              </div>
              <p>Nous avons hâte de vous accueillir !</p>
            ` : `
              <p>Malheureusement, votre réservation a été annulée car le paiement n'a pas été effectué.</p>
              <p>N'hésitez pas à effectuer une nouvelle réservation sur notre site.</p>
            `}
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

    const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
      body: { 
        booking,
        subject,
        html: emailHtml
      }
    });

    if (emailError) {
      console.error('❌ Error sending confirmation email:', emailError);
      throw emailError;
    }

    console.log('✅ Confirmation email sent successfully');
  } catch (error) {
    console.error('❌ Error in sendConfirmationEmail:', error);
    // On ne relance pas l'erreur pour ne pas bloquer le processus
    // mais on la log pour le debugging
  }
};