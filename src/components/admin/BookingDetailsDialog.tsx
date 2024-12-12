import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Users, Euro, Mail, Phone, MessageSquare } from "lucide-react";
import { BookingStatusBadge } from "./BookingStatusBadge";

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
    isTestBooking?: boolean;
  };
}

export const BookingDetailsDialog = ({ isOpen, onClose, booking }: BookingDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
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
          <div className="space-y-2">
            <h3 className="font-semibold">Informations client</h3>
            <div className="space-y-1 text-sm">
              <p className="flex items-center">
                <span className="font-medium">{booking.user_name}</span>
              </p>
              <p className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                {booking.user_email}
              </p>
              <p className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                {booking.user_phone}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Détails de la réservation</h3>
            <div className="space-y-1 text-sm">
              <p className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(booking.date), "d MMMM yyyy", { locale: fr })}
              </p>
              <p className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {booking.time_slot}h - {parseInt(booking.time_slot) + parseInt(booking.duration)}h
              </p>
              <p className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                {booking.group_size} personnes
              </p>
              <p className="flex items-center">
                <Euro className="mr-2 h-4 w-4" />
                {booking.price}€
              </p>
            </div>
          </div>

          {booking.message && (
            <div className="space-y-2">
              <h3 className="font-semibold">Message</h3>
              <p className="text-sm flex items-start">
                <MessageSquare className="mr-2 h-4 w-4 mt-0.5" />
                {booking.message}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};