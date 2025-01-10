import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralStats } from "./sections/GeneralStats";
import { BookingAnalytics } from "./sections/BookingAnalytics";
import { PromoAnalytics } from "./sections/PromoAnalytics";

export const AnalyticsContent = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Statistiques générales</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="promos">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralStats />
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