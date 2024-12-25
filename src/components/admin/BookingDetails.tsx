import { Calendar, Clock, Users, Euro, Mail, Phone, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BookingDetailsProps {
  date: string;
  timeSlot: string;
  duration: string;
  groupSize: string;
  price: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  message?: string;
}

export const BookingDetails = ({
  date,
  timeSlot,
  duration,
  groupSize,
  price,
  userName,
  userEmail,
  userPhone,
  message,
}: BookingDetailsProps) => {
  const startHour = parseInt(timeSlot);
  const endHour = startHour + parseInt(duration);

  // Format hours to ensure they always have two digits
  const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-violet-500" />
          <span className="font-medium">
            {format(new Date(date), "EEEE d MMMM yyyy", { locale: fr })}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4 text-violet-500" />
          <span>
            {formatHour(startHour)} - {formatHour(endHour)} ({duration}h)
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Users className="mr-2 h-4 w-4 text-violet-500" />
          <span>{groupSize} personnes</span>
        </div>
        <div className="flex items-center text-sm">
          <Euro className="mr-2 h-4 w-4 text-violet-500" />
          <span>{price}€</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-gray-700">Informations de contact</h3>
        <div className="flex items-center text-sm">
          <span className="font-medium">{userName}</span>
        </div>
        <div className="flex items-center text-sm">
          <Mail className="mr-2 h-4 w-4 text-violet-500" />
          <span>{userEmail}</span>
        </div>
        <div className="flex items-center text-sm">
          <Phone className="mr-2 h-4 w-4 text-violet-500" />
          <span>{userPhone}</span>
        </div>
      </div>

      {message && (
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-gray-700">Message</h3>
          <div className="flex items-start text-sm">
            <MessageSquare className="mr-2 h-4 w-4 text-violet-500 mt-0.5" />
            <span className="text-gray-600">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
};