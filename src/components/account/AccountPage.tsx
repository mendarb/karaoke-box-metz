import { AccountLayout } from "./AccountLayout";
import { ProfileSection } from "./ProfileSection";
import { SecuritySection } from "./SecuritySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AccountPage = () => {
  return (
    <AccountLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Mon compte
          </h1>
          <p className="text-muted-foreground text-lg">
            Gérez vos informations personnelles et vos préférences de sécurité
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="bg-white/50 backdrop-blur-sm border w-full justify-start gap-2 p-1 h-auto flex-wrap">
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-900 px-4 py-2.5"
            >
              Profil
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-900 px-4 py-2.5"
            >
              Sécurité
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-8">
            <ProfileSection />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-8">
            <SecuritySection />
          </TabsContent>
        </Tabs>
      </div>
    </AccountLayout>
  );
};