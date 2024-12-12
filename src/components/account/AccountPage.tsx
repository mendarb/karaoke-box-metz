import { AccountLayout } from "./AccountLayout";
import { ProfileSection } from "./ProfileSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export const AccountPage = () => {
  return (
    <AccountLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mon compte</h1>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Sécurité du compte</h2>
              <p className="text-sm text-gray-600 mb-4">
                Pour modifier votre mot de passe ou votre email, un lien de confirmation vous sera envoyé par email.
              </p>
              {/* Les fonctionnalités de sécurité seront implémentées dans une prochaine itération */}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AccountLayout>
  );
};