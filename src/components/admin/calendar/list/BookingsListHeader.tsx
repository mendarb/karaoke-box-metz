import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BookingsListHeaderProps {
  selectedDate?: Date;
}

export const BookingsListHeader = ({ selectedDate }: BookingsListHeaderProps) => {
  return (
    <div className="p-4 bg-white/50 backdrop-blur sticky top-0 z-10 border-b">
      <h2 className="text-base font-medium">
        {selectedDate ? (
          `${format(selectedDate, 'd MMMM yyyy', { locale: fr })}`
        ) : (
          'Sélectionnez une date'
        )}
      </h2>
    </div>
  );
};