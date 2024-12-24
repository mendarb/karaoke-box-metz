import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDisabledDates } from "./hooks/useDisabledDates";
import { useDateTimeSelection } from "./hooks/useDateTimeSelection";
import { CalendarSection } from "./calendar/CalendarSection";
import { TimeSlotsSection } from "./TimeSlotsSection";
import { useBookingSettings } from "./hooks/useBookingSettings";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void;
}

export const DateTimeFields = ({ form, onAvailabilityChange }: DateTimeFieldsProps) => {
  const {
    selectedDate,
    handleDateSelect,
    handleTimeSlotChange
  } = useDateTimeSelection(form, onAvailabilityChange);

  const { minDate, maxDate, settings } = useBookingSettings();
  const { disabledDates } = useDisabledDates({ minDate, maxDate });

  useEffect(() => {
    const timeSlot = form.watch("timeSlot");
    if (timeSlot && selectedDate) {
      handleTimeSlotChange(timeSlot);
    }
  }, [form.watch("timeSlot"), selectedDate, handleTimeSlotChange]);

  return (
    <div className="space-y-8">
      <CalendarSection
        form={form}
        selectedDate={selectedDate}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        onDateSelect={handleDateSelect}
      />

      {selectedDate && (
        <TimeSlotsSection
          form={form}
          selectedDate={selectedDate}
          onAvailabilityChange={(hasSlots) => {
            if (!hasSlots) {
              onAvailabilityChange(selectedDate, 0);
            }
          }}
        />
      )}
    </div>
  );
};