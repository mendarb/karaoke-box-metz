import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User } from "lucide-react";

interface Booking {
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

interface StaffBookingsListProps {
  bookings: Booking[];
  selectedDate?: Date;
  isLoading: boolean;
}

export const StaffBookingsList = ({
  bookings,
  selectedDate,
  isLoading,
}: StaffBookingsListProps) => {
  return (
    <div className="divide-y divide-gray-100">
      <div className="p-4 bg-white/50 backdrop-blur sticky top-0 z-10 border-b">
        <h2 className="text-base font-medium">
          {selectedDate ? (
            format(selectedDate, "d MMMM yyyy", { locale: fr })
          ) : (
            "Sélectionnez une date"
          )}
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            Aucune réservation pour cette date
          </div>
        ) : (
          bookings.map((booking, index) => {
            const startHour = parseInt(booking.time_slot);
            const endHour = startHour + parseInt(booking.duration);

            return (
              <div
                key={index}
                className="p-4 hover:bg-accent/5 transition-colors space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-violet-500 shrink-0" />
                    <p className="font-medium">{booking.user_name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <a
                      href={`mailto:${booking.user_email}`}
                      className="hover:text-violet-500"
                    >
                      {booking.user_email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <a
                      href={`tel:${booking.user_phone}`}
                      className="hover:text-violet-500"
                    >
                      {booking.user_phone}
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs">
                    {`${startHour}h00 - ${endHour}h00`}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {booking.group_size} pers.
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {booking.duration}h
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};