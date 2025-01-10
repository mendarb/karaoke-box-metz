import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralStats } from "./sections/GeneralStats";
import { BookingAnalytics } from "./sections/BookingAnalytics";
import { PromoAnalytics } from "./sections/PromoAnalytics";

export const AnalyticsContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <select className="bg-white border rounded-md px-3 py-2">
          <option>Ce mois</option>
          <option>3 derniers mois</option>
          <option>Cette année</option>
        </select>
      </div>

      <GeneralStats />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="promos">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Aperçu des performances</h3>
              <BookingAnalytics />
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Répartition des réservations</h3>
              <PromoAnalytics />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <BookingAnalytics />
        </TabsContent>

        <TabsContent value="promos">
          <PromoAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};