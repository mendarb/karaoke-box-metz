import { AccountLayout } from "./AccountLayout";
import { ProfileSection } from "./ProfileSection";
import { SecuritySection } from "./SecuritySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <SecuritySection />
          </TabsContent>
        </Tabs>
      </div>
    </AccountLayout>
  );
};