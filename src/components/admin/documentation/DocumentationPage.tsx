import { DashboardLayout } from "../dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const developerDocs = [
  {
    title: "Gestion des Utilisateurs",
    description: "Service de gestion des utilisateurs (userService.ts)",
    content: `
      Le service de gestion des utilisateurs permet de :
      - Rechercher des utilisateurs existants par email
      - Créer de nouveaux comptes utilisateurs
      - Gérer l'authentification par email (OTP)
      
      Logs disponibles :
      - 🔍 Recherche d'utilisateur : "Recherche d'un utilisateur avec l'email: example@email.com"
      - ✨ Création d'utilisateur : "Création d'un nouvel utilisateur: John Doe"
      - ✅ Succès : "Utilisateur trouvé/créé avec succès"
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
      
      Logs disponibles :
      - 📝 Création : "Début de création d'une réservation admin"
      - 💰 Paiement : "Génération du lien de paiement"
      - ✅ Succès : "Réservation créée avec succès"
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
      
      Fonctionnalités principales :
      1. Création de réservation :
         - Recherche de client existant ou création
         - Sélection de date et durée
         - Génération de lien de paiement
      
      2. Gestion des réservations :
         - Modification du statut
         - Annulation
         - Consultation des détails
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
      
      Types de codes disponibles :
      - Pourcentage de réduction
      - Montant fixe
      - Période limitée
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
      2. Choix du nombre de personnes
      3. Renseignement des informations
      4. Paiement sécurisé
      
      Points importants :
      - Vérification en temps réel des disponibilités
      - Possibilité d'utiliser un code promo
      - Email de confirmation automatique
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
      
      Sécurité :
      - Authentification par email
      - Modification du mot de passe
      - Déconnexion sécurisée
    `
  }
];

export const DocumentationPage = () => {
  const renderDocSection = (docs: typeof developerDocs) => (
    <div className="space-y-6">
      {docs.map((doc, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{doc.title}</CardTitle>
            <CardDescription>{doc.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm">{doc.content}</pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Documentation</h1>
        
        <Tabs defaultValue="admin" className="space-y-4">
          <TabsList>
            <TabsTrigger value="admin">Guide Administrateur</TabsTrigger>
            <TabsTrigger value="dev">Guide Développeur</TabsTrigger>
            <TabsTrigger value="user">Guide Utilisateur</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-200px)]">
            <TabsContent value="dev" className="space-y-4">
              {renderDocSection(developerDocs)}
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              {renderDocSection(adminDocs)}
            </TabsContent>
            
            <TabsContent value="user" className="space-y-4">
              {renderDocSection(userDocs)}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};