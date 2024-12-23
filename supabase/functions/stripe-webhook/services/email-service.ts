import { Resend } from 'resend';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

export async function sendBookingConfirmationEmail(booking: any) {
  console.log('Sending confirmation email for booking:', booking.id);

  const formattedDate = format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr });
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Escape Game <reservations@escapegame-metz.fr>',
      to: [booking.user_email],
      subject: 'Confirmation de votre réservation - Escape Game Metz',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Votre réservation est confirmée !</h1>
          
          <p>Bonjour ${booking.user_name},</p>
          
          <p>Nous avons le plaisir de vous confirmer votre réservation pour notre escape game :</p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date :</strong> ${formattedDate}</p>
            <p><strong>Heure :</strong> ${booking.time_slot}</p>
            <p><strong>Durée :</strong> ${booking.duration} heure(s)</p>
            <p><strong>Nombre de participants :</strong> ${booking.group_size} personne(s)</p>
          </div>
          
          <h2 style="color: #4F46E5;">Informations importantes</h2>
          
          <ul>
            <li>Merci d'arriver 15 minutes avant l'heure de votre réservation</li>
            <li>L'adresse exacte vous sera communiquée par SMS le jour de votre venue</li>
            <li>En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance</li>
          </ul>
          
          <p>Pour toute question, n'hésitez pas à nous contacter :</p>
          <p>📞 <a href="tel:+33612345678">06 12 34 56 78</a></p>
          
          <p style="margin-top: 40px;">À très bientôt !</p>
          <p>L'équipe Escape Game Metz</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Confirmation email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
}