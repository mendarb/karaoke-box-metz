import { BookingHistory } from "@/components/booking/BookingHistory";
import { AccountLayout } from "@/components/account/AccountLayout";

const MyBookings = () => {
  return (
    <AccountLayout>
      <div className="space-y-6 px-4 md:px-0">
        <h1 className="text-2xl font-bold text-gray-900">Mes réservations</h1>
        <BookingHistory />
      </div>
    </AccountLayout>
  );
};

export default MyBookings;