import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarNavButton } from "./CalendarNavButton";

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

  const isDiscountedDay = (date: Date) => {
    const day = date.getDay();
    return day === 3 || day === 4; // Mercredi ou Jeudi
  };

  useEffect(() => {
    toast({
      title: "Sélectionnez une date",
      description: "Choisissez une date disponible pour votre réservation",
      duration: 3000,
    });
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl p-2 sm:p-4">
      <CalendarHeader />
      
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
        modifiers={{
          discount: (date) => isDiscountedDay(date),
        }}
        modifiersClassNames={{
          discount: "bg-green-50 text-green-600 relative discount-day",
        }}
        locale={fr}
        defaultMonth={defaultMonth}
        className="border-none shadow-none"
        components={{
          IconLeft: (props) => <CalendarNavButton direction="left" {...props} />,
          IconRight: (props) => <CalendarNavButton direction="right" {...props} />,
        }}
        classNames={{
          months: "space-y-4",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-lg font-semibold",
          nav: "space-x-1 flex items-center",
          nav_button: "h-8 w-8",
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

      <style>
        {`
          .discount-day::after {
            content: "-20%";
            position: absolute;
            top: -2px;
            right: -2px;
            font-size: 0.6rem;
            background-color: #22c55e;
            color: white;
            padding: 1px 3px;
            border-radius: 4px;
            transform: scale(0.8);
          }
        `}
      </style>
    </div>
  );
};