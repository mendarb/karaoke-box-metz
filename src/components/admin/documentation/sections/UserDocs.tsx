import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users } from "lucide-react";

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
    <div className="space-y-8">
      {userDocs.map((doc, index) => (
        <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">{doc.title}</CardTitle>
                <p className="text-gray-600 mt-1">{doc.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-gray max-w-none">
              <div className="space-y-4">
                {doc.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.trim().startsWith('-')) {
                    const items = paragraph.split('\n').filter(item => item.trim());
                    return (
                      <ul key={idx} className="space-y-2">
                        {items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2">
                            <FileText className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{item.replace('-', '').trim()}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.includes(':')) {
                    const [title, ...content] = paragraph.split(':');
                    return (
                      <div key={idx} className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title.trim()}</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          {content.join(':').trim().split('\n').map((line, lineIdx) => (
                            <div key={lineIdx} className="flex items-start gap-2 text-gray-700">
                              {line.trim()}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return <p key={idx} className="text-gray-700">{paragraph}</p>;
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
