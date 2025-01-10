import { useBookingAnalytics } from "../hooks/useBookingAnalytics";
import { PeriodSelection } from "../types/analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { calculateAnalyticsStats } from "../utils/analyticsCalculations";
import { BookingStepsChart } from "../charts/BookingStepsChart";
import { DurationChart } from "../charts/DurationChart";
import { GroupSizeChart } from "../charts/GroupSizeChart";
import { WeekdayChart } from "../charts/WeekdayChart";

interface BookingAnalyticsProps {
  period: PeriodSelection;
}

export const BookingAnalytics = ({ period }: BookingAnalyticsProps) => {
  const { bookings, previousBookings, events, previousEvents, isLoading } = useBookingAnalytics(period);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const stats = calculateAnalyticsStats(bookings || [], previousBookings || [], events || [], previousEvents || []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Réservations payées</CardTitle>
            <CardDescription>
              {stats.variations.paidBookings >= 0 ? "+" : ""}
              {stats.variations.paidBookings.toFixed(1)}% vs période précédente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentPeriod.paidBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réservations administrateur</CardTitle>
            <CardDescription>
              {stats.variations.adminBookings >= 0 ? "+" : ""}
              {stats.variations.adminBookings.toFixed(1)}% vs période précédente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentPeriod.adminBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux de conversion</CardTitle>
            <CardDescription>
              {stats.variations.conversionRate >= 0 ? "+" : ""}
              {stats.variations.conversionRate.toFixed(1)}% vs période précédente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentPeriod.conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Étapes de réservation</CardTitle>
            <CardDescription>Progression et abandon par étape</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingStepsChart data={events || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Durées réservées</CardTitle>
            <CardDescription>Distribution des durées de réservation</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <DurationChart bookings={bookings || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taille des groupes</CardTitle>
            <CardDescription>Distribution de la taille des groupes</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <GroupSizeChart bookings={bookings || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jours de réservation</CardTitle>
            <CardDescription>Distribution des réservations par jour</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <WeekdayChart bookings={bookings || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};