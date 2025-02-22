import { Badge } from "@/components/ui/badge";

interface BookingInfoBadgesProps {
  timeSlot: string;
  duration: number;
  groupSize: string;
  price: number;
}

export const BookingInfoBadges = ({ 
  timeSlot, 
  duration, 
  groupSize, 
  price 
}: BookingInfoBadgesProps) => {
  const formatTimeSlot = (startHour: number, duration: number) => {
    const endHour = startHour + duration;
    return `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Badge variant="outline" className="text-xs">
        {formatTimeSlot(parseInt(timeSlot), duration)}
      </Badge>
      <Badge variant="outline" className="text-xs">
        {groupSize} pers.
      </Badge>
      <Badge variant="outline" className="text-xs">
        {duration}h
      </Badge>
      <Badge variant="outline" className="text-xs">
        {price}€
      </Badge>
    </div>
  );
};