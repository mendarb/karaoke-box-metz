import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CalendarSectionProps {
  selectedDate?: Date;
  setSelectedDate: (date: Date | undefined) => void;
  isLoading: boolean;
  bookedDays: Date[];
}

export const CalendarSection = ({
  selectedDate,
  setSelectedDate,
  isLoading,
  bookedDays,
}: CalendarSectionProps) => {
  const modifiers = {
    booked: (date: Date) =>
      bookedDays.some(
        (bookedDate) =>
          bookedDate.toISOString().split("T")[0] ===
          date.toISOString().split("T")[0]
      ),
  };

  const modifiersStyles = {
    booked: {
      backgroundColor: "#f3f4f6",
      color: "#111827",
      fontWeight: "bold",
    },
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <LoadingSpinner className="h-8 w-8" />
          </div>
        ) : (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="rounded-md"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] uppercase",
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md transition-colors",
              day_range_end: "day-range-end",
              day_selected: "bg-violet-500 text-white hover:bg-violet-500 hover:text-white focus:bg-violet-500 focus:text-white",
              day_today: "bg-violet-50 text-violet-500",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_hidden: "invisible",
            }}
          />
        )}
      </div>
      {!selectedDate && !isLoading && (
        <Alert className="bg-violet-500/5 border-violet-500/20">
          <Info className="h-4 w-4 text-violet-500" />
          <AlertDescription className="text-violet-500/80">
            Sélectionnez une date pour voir les réservations
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};