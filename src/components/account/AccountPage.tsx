import { AccountLayout } from "./AccountLayout";
import { ProfileSection } from "./ProfileSection";
import { SecuritySection } from "./SecuritySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AccountPage = () => {
  return (
    <AccountLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mon compte</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et vos préférences de sécurité
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <ProfileSection />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <SecuritySection />
          </TabsContent>
        </Tabs>
      </div>
    </AccountLayout>
  );
};