import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const developerDocs = [
  {
    title: "Gestion des Utilisateurs",
    description: "Service de gestion des utilisateurs (userService.ts)",
    content: `
      Le service de gestion des utilisateurs permet de :
      - Rechercher des utilisateurs existants par email
      - Créer de nouveaux comptes utilisateurs
      - Gérer l'authentification par email (OTP)
      - Mise à jour des profils utilisateurs
      
      Logs disponibles :
      - 🔍 Recherche d'utilisateur : "Recherche d'un utilisateur avec l'email: example@email.com"
      - ✨ Création d'utilisateur : "Création d'un nouvel utilisateur: John Doe"
      - ✅ Succès : "Utilisateur trouvé/créé avec succès"
      - 📝 Mise à jour : "Mise à jour du profil utilisateur"

      Fonctions principales :
      - findUserByEmail(email: string) : Recherche un utilisateur par email
      - createUser(data: UserData) : Crée un nouvel utilisateur
      - updateUserProfile(userId: string, data: ProfileData) : Met à jour le profil
      - sendAuthEmail(email: string) : Envoie un email d'authentification OTP
    `
  },
  {
    title: "Gestion des Réservations (Admin)",
    description: "Service de gestion des réservations (bookingService.ts)",
    content: `
      Le service de réservation admin permet de :
      - Créer des réservations pour les clients
      - Générer des liens de paiement
      - Gérer le statut des réservations
      - Recevoir des notifications par email
      - Gérer les codes promo
      - Gérer les réservations test
      
      Logs disponibles :
      - 📝 Création : "Début de création d'une réservation admin"
      - 💰 Paiement : "Génération du lien de paiement"
      - 📧 Email : "Envoi de l'email de confirmation"
      - ✅ Succès : "Réservation créée avec succès"
      - 🎫 Promo : "Application du code promo"
      - 🧪 Test : "Création d'une réservation test"

      Format des dates et heures :
      - Les heures sont toujours au format "HH:00" (ex: "09:00")
      - Les dates sont au format français (ex: "jeudi 24 janvier 2024")
      - La durée est en heures (1, 2, 3 ou 4)

      Fonctions principales :
      - createBooking(data: BookingData) : Crée une nouvelle réservation
      - generatePaymentLink(data: PaymentData) : Génère un lien de paiement Stripe
      - updateBookingStatus(id: string, status: BookingStatus) : Met à jour le statut
      - sendConfirmationEmail(booking: Booking) : Envoie l'email de confirmation
      - applyPromoCode(code: string, amount: number) : Applique un code promo
    `
  },
  {
    title: "Gestion des Paiements",
    description: "Service de gestion des paiements (paymentService.ts)",
    content: `
      Le service de paiement permet de :
      - Créer des sessions de paiement Stripe
      - Gérer les webhooks Stripe
      - Générer des factures
      - Gérer les remboursements
      
      Logs disponibles :
      - 💳 Paiement : "Création d'une session de paiement"
      - 📧 Webhook : "Réception d'un webhook Stripe"
      - 🧾 Facture : "Génération de la facture"
      - ♻️ Remboursement : "Traitement du remboursement"

      Fonctions principales :
      - createCheckoutSession(data: PaymentData) : Crée une session Stripe
      - handleWebhook(event: StripeEvent) : Gère les webhooks Stripe
      - generateInvoice(bookingId: string) : Génère une facture PDF
      - processRefund(bookingId: string) : Traite un remboursement

      Modes de test :
      - Utiliser les cartes de test Stripe (4242 4242 4242 4242)
      - Activer le mode test dans les paramètres
      - Les emails de test sont envoyés à Mailtrap
    `
  }
];

export const DeveloperDocs = () => {
  return (
    <div className="space-y-6">
      {developerDocs.map((doc, index) => (
        <Card key={index} className="animate-fadeIn">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{doc.title}</CardTitle>
            <CardDescription>{doc.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto">
              {doc.content}
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};