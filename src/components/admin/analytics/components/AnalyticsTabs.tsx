import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingAnalytics } from "../sections/BookingAnalytics";
import { PromoAnalytics } from "../sections/PromoAnalytics";
import { PeriodSelection } from "../types/analytics";

interface AnalyticsTabsProps {
  period: PeriodSelection;
}

export const AnalyticsTabs = ({ period }: AnalyticsTabsProps) => {
  return (
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
            <BookingAnalytics period={period} />
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Performance des promotions</h3>
            <PromoAnalytics period={period} />
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="bookings">
        <BookingAnalytics period={period} />
      </TabsContent>

      <TabsContent value="promos">
        <PromoAnalytics period={period} />
      </TabsContent>
    </Tabs>
  );
};