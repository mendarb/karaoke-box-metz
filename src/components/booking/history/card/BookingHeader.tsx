import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";

interface BookingHeaderProps {
  date: string;
  startHour: number;
  endHour: number;
  status: string;
  paymentStatus: string;
  isTestBooking: boolean;
}

export const BookingHeader = ({ 
  date, 
  startHour, 
  endHour, 
  status, 
  paymentStatus, 
  isTestBooking 
}: BookingHeaderProps) => {
  // Ensure we're working with a proper Date object
  const bookingDate = new Date(date);
  // Add timezone offset to compensate for UTC conversion
  bookingDate.setMinutes(bookingDate.getMinutes() + bookingDate.getTimezoneOffset());

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-violet-500" />
          <span className="font-medium capitalize">
            {format(bookingDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </span>
        </div>
        <BookingStatusBadge 
          status={status} 
          paymentStatus={paymentStatus}
          isTestBooking={isTestBooking}
        />
      </div>
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <Clock className="h-4 w-4 text-violet-500" />
        <span>{startHour}:00 - {endHour}:00</span>
      </div>
    </div>
  );
};