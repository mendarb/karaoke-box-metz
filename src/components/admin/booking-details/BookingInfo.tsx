import { Calendar, Clock, Users, Euro, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BookingInfoProps {
  date: string;
  timeSlot: string;
  duration: string;
  groupSize: string;
  price: number;
  paymentMethod: string;
}

export const BookingInfo = ({ 
  date, 
  timeSlot, 
  duration, 
  groupSize, 
  price,
  paymentMethod 
}: BookingInfoProps) => {
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'Carte bancaire (Stripe)';
      case 'sumup':
        return 'Carte bancaire (SumUp)';
      case 'cash':
        return 'Espèces';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Détails de la réservation</h3>
      <div className="space-y-1 text-sm">
        <p className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          {format(new Date(date), "d MMMM yyyy", { locale: fr })}
        </p>
        <p className="flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          {timeSlot}h - {parseInt(timeSlot) + parseInt(duration)}h
        </p>
        <p className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          {groupSize} personnes
        </p>
        <p className="flex items-center">
          <Euro className="mr-2 h-4 w-4" />
          {price}€
        </p>
        <p className="flex items-center">
          <CreditCard className="mr-2 h-4 w-4" />
          {getPaymentMethodLabel(paymentMethod)}
        </p>
      </div>
    </div>
  );
};