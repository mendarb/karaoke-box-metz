import { BookingHistory } from "@/components/booking/BookingHistory";
import { AccountLayout } from "@/components/account/AccountLayout";

const MyBookings = () => {
  return (
    <AccountLayout>
      <div className="space-y-6 px-4 md:px-0">
        <BookingHistory />
      </div>
    </AccountLayout>
  );
};

export default MyBookings;