import { AccountLayout } from "./AccountLayout";
import { ProfileSection } from "./ProfileSection";
import { SecuritySection } from "./SecuritySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AccountPage = () => {
  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Mon compte</h1>
        </div>
        
        <div className="glass rounded-lg p-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
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
      </div>
    </AccountLayout>
  );
};