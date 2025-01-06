import { AccountLayout } from "./AccountLayout";
import { ProfileSection } from "./ProfileSection";
import { SecuritySection } from "./SecuritySection";
import { SavedBookingsSection } from "./SavedBookingsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AccountPage = () => {
  return (
    <AccountLayout>
      <div className="space-y-6 px-4 md:px-0">
        <div className="flex items-center justify-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Mon compte</h1>
        </div>
        
        <div className="glass rounded-lg p-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="saved">Réservations sauvegardées</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <ProfileSection />
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <SecuritySection />
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              <SavedBookingsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AccountLayout>
  );
};