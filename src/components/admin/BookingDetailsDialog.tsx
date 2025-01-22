import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { CustomerInfo } from "./booking-details/CustomerInfo";
import { BookingInfo } from "./booking-details/BookingInfo";
import { BookingMessage } from "./booking-details/BookingMessage";
import { BookingDocuments } from "./booking-details/BookingDocuments";

interface BookingDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    date: string;
    time_slot: string;
    duration: string;
    group_size: string;
    price: number;
    user_name: string;
    user_email: string;
    user_phone: string;
    message: string | null;
    status: string;
    payment_status: string;
    payment_method: string;
    isTestBooking?: boolean;
    invoice_url?: string;
  };
}

export const BookingDetailsDialog = ({ isOpen, onClose, booking }: BookingDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails de la réservation</span>
            <BookingStatusBadge 
              status={booking.status}
              paymentStatus={booking.payment_status}
              isTestBooking={booking.isTestBooking}
            />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <CustomerInfo
            name={booking.user_name}
            email={booking.user_email}
            phone={booking.user_phone}
          />

          <BookingInfo
            date={booking.date}
            timeSlot={booking.time_slot}
            duration={booking.duration}
            groupSize={booking.group_size}
            price={booking.price}
            paymentMethod={booking.payment_method}
          />

          <BookingMessage message={booking.message} />

          {booking.payment_status === 'paid' && booking.invoice_url && (
            <BookingDocuments
              invoiceUrl={booking.invoice_url}
              isTestBooking={booking.isTestBooking}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};