import { DashboardLayout } from "@/components/admin/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingSettings } from "@/components/admin/settings/BookingSettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { PromoCodesSettings } from "@/components/admin/settings/PromoCodesSettings";
import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings as SettingsIcon } from "lucide-react";

export const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4 text-violet-500" />
            <h1 className="text-base font-medium">Paramètres</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Configurez les paramètres de votre application
          </p>
        </div>
        
        <ScrollArea className="w-full">
          <Tabs defaultValue="booking" className="space-y-4">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="booking" className="text-sm">Réservations</TabsTrigger>
              <TabsTrigger value="promo" className="text-sm">Codes promo</TabsTrigger>
              <TabsTrigger value="notifications" className="text-sm">Notifications</TabsTrigger>
              <TabsTrigger value="site" className="text-sm">Site</TabsTrigger>
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
        </ScrollArea>
      </div>
    </DashboardLayout>
  );
};