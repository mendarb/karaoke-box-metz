import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

const formatName = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const BookingDetails = ({ booking, startHour, endHour }: { booking: Booking; startHour: number; endHour: number }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-violet-500" />
        <p className="font-medium">{formatName(booking.user_name)}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Mail className="h-4 w-4" />
        <a href={`mailto:${booking.user_email}`} className="hover:text-violet-500">
          {booking.user_email}
        </a>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Phone className="h-4 w-4" />
        <a href={`tel:${booking.user_phone}`} className="hover:text-violet-500">
          {booking.user_phone}
        </a>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">{`${startHour}h00 - ${endHour}h00`}</Badge>
      <Badge variant="outline">{booking.group_size} pers.</Badge>
      <Badge variant="outline">{booking.duration}h</Badge>
    </div>
  </div>
);

export const StaffBookingsList = ({
  bookings,
  selectedDate,
  isLoading,
}: StaffBookingsListProps) => {
  return (
    <div className="bg-white rounded-lg">
      <div className="p-4 bg-white sticky top-0 z-10">
        <h2 className="text-base font-medium">
          {selectedDate ? (
            format(selectedDate, "d MMMM yyyy", { locale: fr })
          ) : (
            "Sélectionnez une date"
          )}
        </h2>
      </div>

      <div>
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
                className="p-4 hover:bg-gray-50 transition-colors border-t first:border-t-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-violet-500 shrink-0" />
                      <p className="font-medium truncate">{formatName(booking.user_name)}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {`${startHour}h00 - ${endHour}h00`}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {booking.group_size} pers.
                    </Badge>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Détails de la réservation</DialogTitle>
                      </DialogHeader>
                      <BookingDetails 
                        booking={booking}
                        startHour={startHour}
                        endHour={endHour}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};