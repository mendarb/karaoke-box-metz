import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Clock, Euro } from "lucide-react";
import { Booking } from "@/hooks/useBookings";

interface DashboardStatsProps {
  bookings: Booking[];
}

export const DashboardStats = ({ bookings }: DashboardStatsProps) => {
  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    totalRevenue: bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, booking) => sum + Number(booking.price), 0),
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-2">
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          <Calendar className="h-4 w-4 text-violet-500" />
        </CardHeader>
        <CardContent className="pb-4 px-4">
          <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
          <p className="text-xs text-gray-500 mt-1">Réservations totales</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-600">En attente</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent className="pb-4 px-4">
          <div className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</div>
          <p className="text-xs text-gray-500 mt-1">Réservations en attente</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-600">Confirmées</CardTitle>
          <Users className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className="pb-4 px-4">
          <div className="text-2xl font-bold text-gray-900">{stats.confirmedBookings}</div>
          <p className="text-xs text-gray-500 mt-1">Réservations confirmées</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-600">Revenus</CardTitle>
          <Euro className="h-4 w-4 text-violet-500" />
        </CardHeader>
        <CardContent className="pb-4 px-4">
          <div className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)}€</div>
          <p className="text-xs text-gray-500 mt-1">Total des revenus</p>
        </CardContent>
      </Card>
    </div>
  );
};