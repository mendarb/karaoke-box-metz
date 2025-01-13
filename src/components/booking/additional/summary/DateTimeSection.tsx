import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";

interface DateTimeSectionProps {
  date: string;
  timeSlot: string;
  duration: string;
}

export const DateTimeSection = ({ date, timeSlot, duration }: DateTimeSectionProps) => {
  const endHour = parseInt(timeSlot) + parseInt(duration);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-violet-500" />
        <p className="font-medium">
          {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-violet-500" />
        <p>
          {timeSlot.padStart(2, '0')}h00 - {endHour.toString().padStart(2, '0')}h00 ({duration}h)
        </p>
      </div>
    </div>
  );
};