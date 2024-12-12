import { AccountLayout } from "@/components/account/AccountLayout";
import { BookingHistory } from "@/components/booking/BookingHistory";

export const MyBookings = () => {
  return (
    <AccountLayout>
      <div className="space-y-8">
        <BookingHistory />
      </div>
    </AccountLayout>
  );
};