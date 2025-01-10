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
    <Tabs defaultValue="bookings" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
        <TabsTrigger value="bookings">Réservations</TabsTrigger>
        <TabsTrigger value="promos">Promotions</TabsTrigger>
      </TabsList>

      <TabsContent value="bookings">
        <BookingAnalytics period={period} />
      </TabsContent>

      <TabsContent value="promos">
        <PromoAnalytics period={period} />
      </TabsContent>
    </Tabs>
  );
};