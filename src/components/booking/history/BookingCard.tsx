import { Card } from "@/components/ui/card";
import { BookingHeader } from "./card/BookingHeader";
import { BookingDetails } from "./card/BookingDetails";
import { PaymentMethod } from "./card/PaymentMethod";
import { TestBookingAlert } from "./card/TestBookingAlert";
import { InvoiceButton } from "./card/InvoiceButton";

interface BookingCardProps {
  booking: any;
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const startHour = parseInt(booking.time_slot);
  const endHour = startHour + parseInt(booking.duration);

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <BookingHeader 
        date={booking.date}
        startHour={startHour}
        endHour={endHour}
        status={booking.status}
        paymentStatus={booking.payment_status}
        isTestBooking={booking.is_test_booking}
      />

      <div className="p-4 space-y-4">
        <BookingDetails 
          groupSize={booking.group_size}
          price={booking.price}
        />

        {booking.payment_method && (
          <PaymentMethod method={booking.payment_method} />
        )}

        <TestBookingAlert isTestBooking={booking.is_test_booking} />

        <InvoiceButton 
          paymentStatus={booking.payment_status}
          invoiceUrl={booking.invoice_url}
          isTestBooking={booking.is_test_booking}
        />
      </div>
    </Card>
  );
};