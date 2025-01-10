import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Info } from "lucide-react";

export const adminDocs = [
  {
    title: "Tableau de Bord",
    description: "Guide d'utilisation du tableau de bord administrateur",
    content: `
      Le tableau de bord permet de :
      - Voir toutes les réservations en cours
      - Créer de nouvelles réservations
      - Gérer les statuts des réservations
      - Accéder aux statistiques
      - Recevoir des notifications par email
      - Gérer les réservations test
      - Gérer les codes promo
      
      Fonctionnalités principales :
      1. Création de réservation :
         - Recherche de client existant ou création
         - Sélection de date et durée
         - Génération de lien de paiement
         - Option de réservation test
      
      2. Gestion des réservations :
         - Modification du statut (pending, confirmed, cancelled)
         - Annulation avec ou sans remboursement
         - Consultation des détails complets
         - Suivi des paiements en temps réel
         - Gestion des factures et reçus
         - Envoi d'emails de confirmation

      3. Statistiques et rapports :
         - Chiffre d'affaires quotidien/mensuel
         - Taux d'occupation des créneaux
         - Performance des codes promo
         - Historique des paiements
         - Export des données en CSV
    `
  },
  {
    title: "Gestion des Codes Promo",
    description: "Guide de gestion des codes promotionnels",
    content: `
      La gestion des codes promo permet de :
      - Créer de nouveaux codes
      - Définir les conditions d'utilisation
      - Suivre l'utilisation en temps réel
      - Gérer la validité temporelle
      
      Types de codes disponibles :
      - Pourcentage de réduction (ex: -20%)
      - Montant fixe (ex: -10€)
      - Période limitée (ex: valable jusqu'au 31/12)
      - Nombre d'utilisations limité
      - Combinaison de conditions
      
      Suivi des utilisations :
      - Nombre d'utilisations maximum
      - Nombre d'utilisations actuel
      - Période de validité
      - Statut actif/inactif
      - Historique des utilisations
      - Impact sur le chiffre d'affaires

      Bonnes pratiques :
      - Limiter le nombre d'utilisations
      - Définir une date d'expiration
      - Utiliser des codes explicites (ex: NOEL2024)
      - Suivre les performances régulièrement
      - Désactiver les codes obsolètes
    `
  },
  {
    title: "Paramètres Système",
    description: "Guide de configuration du système",
    content: `
      Les paramètres système permettent de :
      - Configurer les horaires d'ouverture
      - Gérer les prix et tarifs
      - Configurer les notifications
      - Gérer les périodes de fermeture
      
      Horaires et disponibilités :
      - Définition des créneaux par jour
      - Gestion des jours fériés
      - Périodes de fermeture exceptionnelle
      - Durées de session disponibles
      
      Tarification :
      - Prix de base par heure
      - Supplément par personne
      - Tarifs spéciaux (heures creuses)
      - Packages et forfaits
      
      Notifications :
      - Emails automatiques
      - Rappels SMS
      - Notifications admin
      - Templates personnalisables

      Mode Test :
      - Activation du mode test
      - Cartes de test Stripe
      - Emails de test
      - Simulation de réservations
    `
  }
];

export const AdminDocs = () => {
  return (
    <div className="space-y-8">
      {adminDocs.map((doc, index) => (
        <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <Info className="w-5 h-5 text-blue-600" />
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
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
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
                        <p className="text-gray-700">{content.join(':').trim()}</p>
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