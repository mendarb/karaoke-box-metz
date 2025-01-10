import { Card } from "@/components/ui/card";
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
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-100 p-2">
            <Calendar className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total</p>
            <p className="text-lg font-semibold">{stats.totalBookings}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-100 p-2">
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">En attente</p>
            <p className="text-lg font-semibold">{stats.pendingBookings}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-100 p-2">
            <Users className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Confirmées</p>
            <p className="text-lg font-semibold">{stats.confirmedBookings}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-100 p-2">
            <Euro className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Revenus</p>
            <p className="text-lg font-semibold">{stats.totalRevenue.toFixed(2)}€</p>
          </div>
        </div>
      </Card>
    </div>
  );
};