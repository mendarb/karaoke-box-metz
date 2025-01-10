import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralStats } from "./sections/GeneralStats";
import { BookingAnalytics } from "./sections/BookingAnalytics";
import { PromoAnalytics } from "./sections/PromoAnalytics";

export const AnalyticsContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <select className="bg-white border rounded-md px-3 py-2">
          <option>Ce mois</option>
          <option>3 derniers mois</option>
          <option>Cette année</option>
        </select>
      </div>

      <GeneralStats />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="promos">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Aperçu des performances</h2>
            <BookingAnalytics />
          </Card>
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