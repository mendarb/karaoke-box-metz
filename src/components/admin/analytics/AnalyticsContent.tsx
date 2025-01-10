import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralStats } from "./sections/GeneralStats";
import { BookingAnalytics } from "./sections/BookingAnalytics";
import { PromoAnalytics } from "./sections/PromoAnalytics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AnalyticsContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Select defaultValue="7d">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Dernières 24h</SelectItem>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="90d">3 derniers mois</SelectItem>
            <SelectItem value="1y">Cette année</SelectItem>
            <SelectItem value="custom">Période personnalisée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <GeneralStats />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="promos">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Tendances des réservations</h3>
              <BookingAnalytics />
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Performance des promotions</h3>
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