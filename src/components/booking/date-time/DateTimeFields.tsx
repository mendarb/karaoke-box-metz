import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDisabledDates } from "./hooks/useDisabledDates";
import { useDateTimeSelection } from "./hooks/useDateTimeSelection";
import { CalendarSection } from "./calendar/CalendarSection";
import { TimeSlotsSection } from "./TimeSlotsSection";
import { useBookingSettings } from "./hooks/useBookingSettings";
import { addDays, startOfDay } from "date-fns";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
  onAvailabilityChange: (date: Date | undefined, availableHours: number) => void;
}

export const DateTimeFields = ({ form, onAvailabilityChange }: DateTimeFieldsProps) => {
  const {
    selectedDate,
    availableSlots,
    handleDateSelect,
    handleTimeSlotChange
  } = useDateTimeSelection(form, onAvailabilityChange);

  const { minDate, maxDate, settings } = useBookingSettings();
  const { disabledDates } = useDisabledDates({ minDate, maxDate });

  // Trouver la première date disponible
  const getFirstAvailableDate = () => {
    let currentDate = startOfDay(minDate);
    const endDate = maxDate;
    
    while (currentDate <= endDate) {
      if (!disabledDates.some(disabledDate => 
        disabledDate.toDateString() === currentDate.toDateString()
      )) {
        return currentDate;
      }
      currentDate = addDays(currentDate, 1);
    }
    return minDate;
  };

  useEffect(() => {
    if (!selectedDate) {
      const firstAvailableDate = getFirstAvailableDate();
      handleDateSelect(firstAvailableDate);
    }
  }, []);

  useEffect(() => {
    const timeSlot = form.watch("timeSlot");
    if (timeSlot && selectedDate) {
      handleTimeSlotChange(timeSlot);
    }
  }, [form.watch("timeSlot")]);

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
        defaultMonth={getFirstAvailableDate()}
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