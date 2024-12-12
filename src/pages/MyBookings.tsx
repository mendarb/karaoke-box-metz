import { AccountLayout } from "@/components/account/AccountLayout";
import { ProfileSection } from "@/components/account/ProfileSection";
import { BookingHistory } from "@/components/booking/BookingHistory";

export const MyBookings = () => {
  return (
    <AccountLayout>
      <div className="space-y-8">
        <ProfileSection />
        <BookingHistory />
      </div>
    </AccountLayout>
  );
};