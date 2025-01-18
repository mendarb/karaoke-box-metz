import { UseFormReturn } from "react-hook-form";
import { useDisabledDates } from "./hooks/useDisabledDates";
import { useDateTimeSelection } from "./hooks/useDateTimeSelection";
import { CalendarSection } from "./calendar/CalendarSection";
import { TimeSlotsSection } from "../date-time/TimeSlotsSection";
import { useBookingSettings } from "./hooks/useBookingSettings";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void;
  availableHours: number;  // Ajout de cette prop
}

export const DateTimeFields = ({ form, onAvailabilityChange, availableHours }: DateTimeFieldsProps) => {
  const {
    selectedDate,
    availableSlots,
    handleDateSelect,
    handleTimeSlotChange
  } = useDateTimeSelection(form, onAvailabilityChange);

  const { minDate, maxDate } = useBookingSettings();
  const { disabledDates } = useDisabledDates({ minDate, maxDate });

  console.log('DateTimeFields render:', {
    selectedDate,
    minDate,
    maxDate,
    disabledDates: disabledDates.length,
    availableSlots,
  });

  return (
    <div className="space-y-8">
      <CalendarSection
        form={form}
        selectedDate={selectedDate}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        onDateSelect={handleDateSelect}
        defaultMonth={new Date()}
      />

      {selectedDate && (
        <TimeSlotsSection
          form={form}
          availableSlots={availableSlots}
          isLoading={false}
        />
      )}
    </div>
  );
};