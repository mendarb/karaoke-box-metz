import { DashboardLayout } from "@/components/admin/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingSettings } from "@/components/admin/settings/BookingSettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { PromoCodesSettings } from "@/components/admin/settings/PromoCodesSettings";
import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Settings = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl font-semibold">Paramètres</h1>
          <p className="text-sm text-muted-foreground">
            Configurez les paramètres de votre application
          </p>
        </div>
        
        <ScrollArea className="w-full">
          <Tabs defaultValue="booking" className="space-y-6">
            <TabsList className="w-full justify-start mb-2 overflow-x-auto">
              <TabsTrigger value="booking" className="text-sm">Réservations</TabsTrigger>
              <TabsTrigger value="promo" className="text-sm">Codes promo</TabsTrigger>
              <TabsTrigger value="notifications" className="text-sm">Notifications</TabsTrigger>
              <TabsTrigger value="site" className="text-sm">Site</TabsTrigger>
            </TabsList>
            
            <TabsContent value="booking" className="space-y-4 min-w-full">
              <BookingSettings />
            </TabsContent>
            
            <TabsContent value="promo" className="space-y-4 min-w-full">
              <PromoCodesSettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4 min-w-full">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="site" className="space-y-4 min-w-full">
              <SiteSettingsForm />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </DashboardLayout>
  );
};