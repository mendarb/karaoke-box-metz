import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingSettings } from "@/components/admin/settings/BookingSettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { PromoCodesSettings } from "@/components/admin/settings/PromoCodesSettings";
import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm";

export const Settings = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
        
        <Tabs defaultValue="booking" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="booking">Réservations</TabsTrigger>
            <TabsTrigger value="promo">Codes promo</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="site">Site</TabsTrigger>
          </TabsList>
          
          <TabsContent value="booking" className="space-y-4">
            <BookingSettings />
          </TabsContent>
          
          <TabsContent value="promo" className="space-y-4">
            <PromoCodesSettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="site" className="space-y-4">
            <SiteSettingsForm />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};