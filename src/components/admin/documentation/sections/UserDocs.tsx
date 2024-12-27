import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const userDocs = [
  {
    title: "Réservation",
    description: "Guide de réservation pour les utilisateurs",
    content: `
      Le processus de réservation :
      1. Sélection de la date et durée
         - Choix de la date dans le calendrier
         - Sélection d'un créneau horaire disponible
         - Choix de la durée (1h, 2h, 3h, 4h)
      
      2. Choix du nombre de personnes
         - De 1 à 15 personnes maximum
         - Tarif calculé automatiquement
         - Supplément par personne appliqué
      
      3. Informations personnelles
         - Nom complet
         - Email (pour confirmation)
         - Téléphone (pour rappels)
         - Message optionnel
      
      4. Code promo (optionnel)
         - Saisie du code
         - Vérification automatique
         - Réduction appliquée immédiatement
      
      5. Paiement sécurisé
         - Paiement par carte bancaire
         - Transaction sécurisée Stripe
         - Reçu envoyé par email
      
      Points importants :
      - Vérification en temps réel des disponibilités
      - Email de confirmation automatique
      - Facture/reçu disponible après paiement
      - Possibilité d'annulation selon conditions
      
      Horaires disponibles :
      - Du mercredi au dimanche
      - De 14h à 23h (dernier créneau à 22h)
      - Créneaux d'une heure
      - Réservation jusqu'à 4h consécutives
    `
  },
  {
    title: "Compte Utilisateur",
    description: "Gestion du compte utilisateur",
    content: `
      Fonctionnalités du compte :
      
      1. Historique des réservations
         - Liste des réservations passées
         - Réservations à venir
         - Statut des paiements
         - Téléchargement des factures
      
      2. Informations personnelles
         - Modification du profil
         - Mise à jour du téléphone
         - Changement d'email
         - Préférences de contact
      
      3. Notifications
         - Rappels de réservation
         - Confirmations par email
         - Alertes SMS (optionnel)
         - Newsletters et promotions
      
      4. Sécurité
         - Authentification par email
         - Modification du mot de passe
         - Déconnexion sécurisée
         - Protection des données
      
      5. Avantages membres
         - Accès aux promotions
         - Réservation prioritaire
         - Historique complet
         - Support dédié

      Politique d'annulation :
      - Gratuite jusqu'à 24h avant
      - Conditions spéciales groupes
      - Procédure de remboursement
      - Contact support si besoin
    `
  }
];

export const UserDocs = () => {
  return (
    <div className="space-y-6">
      {userDocs.map((doc, index) => (
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