import { DashboardLayout } from "../dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const developerDocs = [
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
    `
  }
];

const adminDocs = [
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
         - Modification du statut
         - Annulation
         - Consultation des détails
         - Suivi des paiements
         - Gestion des factures
    `
  },
  {
    title: "Gestion des Codes Promo",
    description: "Guide de gestion des codes promotionnels",
    content: `
      La gestion des codes promo permet de :
      - Créer de nouveaux codes
      - Définir les conditions d'utilisation
      - Suivre l'utilisation
      - Gérer la validité temporelle
      
      Types de codes disponibles :
      - Pourcentage de réduction
      - Montant fixe
      - Période limitée
      - Nombre d'utilisations limité
      
      Suivi des utilisations :
      - Nombre d'utilisations maximum
      - Nombre d'utilisations actuel
      - Période de validité
      - Statut actif/inactif
    `
  }
];

const userDocs = [
  {
    title: "Réservation",
    description: "Guide de réservation pour les utilisateurs",
    content: `
      Le processus de réservation :
      1. Sélection de la date et durée
      2. Choix du nombre de personnes (1-15)
      3. Renseignement des informations
      4. Application éventuelle d'un code promo
      5. Paiement sécurisé
      
      Points importants :
      - Vérification en temps réel des disponibilités
      - Possibilité d'utiliser un code promo
      - Email de confirmation automatique
      - Durées disponibles : 1h, 2h, 3h, 4h
      - Créneaux horaires : de 14h à 23h
      - Facture/reçu disponible après paiement
    `
  },
  {
    title: "Compte Utilisateur",
    description: "Gestion du compte utilisateur",
    content: `
      Fonctionnalités du compte :
      - Voir l'historique des réservations
      - Modifier les informations personnelles
      - Gérer les préférences de notification
      - Accéder aux factures
      
      Sécurité :
      - Authentification par email
      - Modification du mot de passe
      - Déconnexion sécurisée
      - Protection des données personnelles
    `
  }
];

export const DocumentationPage = () => {
  const isMobile = useIsMobile();
  
  const renderDocSection = (docs: typeof developerDocs) => (
    <div className="space-y-6">
      {docs.map((doc, index) => (
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

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Documentation</h1>
        
        <Tabs defaultValue="admin" className="space-y-4">
          <TabsList className={`${isMobile ? 'flex flex-col w-full gap-2' : ''}`}>
            <TabsTrigger value="admin" className={isMobile ? 'w-full' : ''}>
              Guide Administrateur
            </TabsTrigger>
            <TabsTrigger value="dev" className={isMobile ? 'w-full' : ''}>
              Guide Développeur
            </TabsTrigger>
            <TabsTrigger value="user" className={isMobile ? 'w-full' : ''}>
              Guide Utilisateur
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-200px)]">
            <TabsContent value="dev" className="space-y-4 pb-6">
              {renderDocSection(developerDocs)}
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4 pb-6">
              {renderDocSection(adminDocs)}
            </TabsContent>
            
            <TabsContent value="user" className="space-y-4 pb-6">
              {renderDocSection(userDocs)}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};