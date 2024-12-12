import { Calendar, Clock, Users, Euro } from "lucide-react";
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
}: BookingDetailsProps) => {
  const startHour = timeSlot;
  const endHour = parseInt(timeSlot) + parseInt(duration);

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4" />
          {format(new Date(date), "d MMMM yyyy", { locale: fr })}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-2 h-4 w-4" />
          {startHour}:00 - {endHour}:00
        </div>
      </div>
      <div className="space-y-1">
        <div className="font-medium">{userName}</div>
        <div className="text-sm text-gray-500">{userEmail}</div>
        <div className="text-sm text-gray-500">{userPhone}</div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center text-sm">
          <Users className="mr-2 h-4 w-4" />
          {groupSize} personnes
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-2 h-4 w-4" />
          {duration}h
        </div>
      </div>
      <div className="flex items-center">
        <Euro className="mr-1 h-4 w-4" />
        {price}€
      </div>
    </>
  );
};