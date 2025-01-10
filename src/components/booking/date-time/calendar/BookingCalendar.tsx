import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

interface BookingCalendarProps {
  selectedDate?: Date;
  onSelect: (date: Date) => void;
  disabledDates: Date[];
  minDate: Date;
  maxDate: Date;
  defaultMonth: Date;
}

export const BookingCalendar = ({
  selectedDate,
  onSelect,
  disabledDates,
  minDate,
  maxDate,
  defaultMonth,
}: BookingCalendarProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Notification discrète pour guider l'utilisateur
    toast({
      title: "Sélectionnez une date",
      description: "Choisissez une date disponible pour votre réservation",
      duration: 3000,
    });
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl p-2 sm:p-4">
      <div className="mb-4 text-center">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Choisissez votre date
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Les dates disponibles sont affichées en noir
        </p>
      </div>
      
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelect(date)}
        disabled={(date) =>
          date < minDate ||
          date > maxDate ||
          disabledDates.some(
            (disabledDate) =>
              disabledDate.toDateString() === date.toDateString()
          )
        }
        locale={fr}
        defaultMonth={defaultMonth}
        className="border-none shadow-none"
        classNames={{
          months: "space-y-4",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-lg font-semibold",
          nav: "space-x-1 flex items-center",
          nav_button: "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-gray-500 rounded-md w-10 sm:w-14 font-normal text-sm",
          row: "flex w-full mt-2",
          cell: "text-center text-sm relative p-0 rounded-md h-10 w-10 sm:h-14 sm:w-14 focus-within:relative focus-within:z-20",
          day: "h-10 w-10 sm:h-14 sm:w-14 p-0 font-normal aria-selected:opacity-100",
          day_selected: "bg-violet-600 text-white hover:bg-violet-700 hover:text-white focus:bg-violet-700 focus:text-white",
          day_today: "bg-gray-100 text-gray-900",
          day_outside: "text-gray-400 opacity-50",
          day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
          day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-gray-900",
          day_hidden: "invisible",
        }}
      />
    </div>
  );
};